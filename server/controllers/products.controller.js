const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Tag = require('../models/Tag');

const SORTS = {
  newest: { createdAt: -1 },
  price_asc: { currentPrice: 1 }, // currentPrice = sale price if there is one (see Product.js)
  price_desc: { currentPrice: -1 },
  rating: { ratingAvg: -1 },
  best_selling: { soldCount: -1 },
};
const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 48;

// Makes user text safe to use inside a regular expression ("a+b" searches for "a+b", not "aab").
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Reads the query string (?q=…&brand=…&sort=…) and builds the MongoDB filter.
// Does not touch the database, so it can be tested on its own.
// Returns { errors: [] } with one entry per invalid value.
function parseProductQuery(query) {
  const errors = [];
  const filter = { isActive: true };

  // Whole number >= min, or the default when the value is missing.
  const wholeNumber = (field, min, fallback) => {
    if (query[field] === undefined) return fallback;
    const value = Number(query[field]);
    if (!Number.isInteger(value) || value < min) {
      errors.push({ field, message: `must be a whole number of at least ${min}` });
    }
    return value;
  };

  if (query.q) {
    filter.name = { $regex: escapeRegex(String(query.q).trim()), $options: 'i' };
  }

  if (query.brand) {
    if (mongoose.isValidObjectId(query.brand)) filter.brand = query.brand;
    else errors.push({ field: 'brand', message: 'must be a brand id' });
  }

  if (query.featured === 'true') filter.isFeatured = true;

  // Price range in cents, on the price the customer pays now (sale price if there is one).
  const minPrice = wholeNumber('minPrice', 0);
  const maxPrice = wholeNumber('maxPrice', 0);
  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.currentPrice = {};
    if (minPrice !== undefined) filter.currentPrice.$gte = minPrice;
    if (maxPrice !== undefined) filter.currentPrice.$lte = maxPrice;
  }

  // Size, colour and stock must match the SAME variant, so they go together in $elemMatch.
  if (query.inStock !== undefined && !['true', 'false'].includes(query.inStock)) {
    errors.push({ field: 'inStock', message: 'must be true or false' });
  }
  const variant = {};
  if (query.size) variant['attributes.size'] = String(query.size);
  if (query.color) variant['attributes.color'] = String(query.color);
  if (query.inStock === 'true') variant.stock = { $gt: 0 };
  if (Object.keys(variant).length) filter.variants = { $elemMatch: variant };

  const sortName = query.sort || 'newest';
  if (!SORTS[sortName]) {
    errors.push({ field: 'sort', message: `must be one of: ${Object.keys(SORTS).join(', ')}` });
  }

  const page = wholeNumber('page', 1, 1);
  const limit = wholeNumber('limit', 1, DEFAULT_LIMIT);
  if (limit > MAX_LIMIT) errors.push({ field: 'limit', message: `must be at most ${MAX_LIMIT}` });

  return {
    errors,
    filter,
    sort: { ...SORTS[sortName], _id: 1 }, // _id as a tie-breaker keeps pages stable
    page,
    limit,
    categorySlug: query.category ? String(query.category) : undefined,
    tagSlug: query.tag ? String(query.tag) : undefined,
  };
}

// Ids of inactive categories and of the subcategories inside them: their products are hidden.
async function hiddenCategoryIds() {
  const inactive = await Category.find({ isActive: false }).distinct('_id');
  const insideInactive = await Category.find({ parent: { $in: inactive } }).distinct('_id');
  return [...inactive, ...insideInactive];
}

// GET /api/products
exports.listProducts = async (req, res, next) => {
  try {
    const { errors, filter, sort, page, limit, categorySlug, tagSlug } = parseProductQuery(req.query);
    if (errors.length) {
      return res.status(400).json({ error: 'Invalid query', details: errors });
    }

    const hidden = await hiddenCategoryIds();
    if (categorySlug) {
      const category = await Category.findOne({ slug: categorySlug, isActive: true });
      if (!category || hidden.some((id) => id.equals(category._id))) {
        return res.status(404).json({ error: 'Category not found' });
      }
      // A top-level category also shows the products of its subcategories.
      const children = await Category.find({ parent: category._id, isActive: true }).distinct('_id');
      filter.category = { $in: [category._id, ...children] };
    } else {
      filter.category = { $nin: hidden };
    }

    if (tagSlug) {
      const tag = await Tag.findOne({ slug: tagSlug });
      if (!tag) return res.status(404).json({ error: 'Tag not found' });
      filter.tags = tag._id;
    }

    const [items, total] = await Promise.all([
      Product.find(filter)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('brand', 'name')
        .populate('category', 'name slug')
        .lean(),
      Product.countDocuments(filter),
    ]);

    res.json({ items, page, totalPages: Math.ceil(total / limit), total });
  } catch (err) {
    next(err);
  }
};

// GET /api/products/:slug
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true })
      .populate('brand', 'name')
      .populate({ path: 'category', select: 'name slug themeColor parent', populate: { path: 'parent', select: 'name slug' } })
      .populate('tags', 'name slug')
      .lean();

    const hidden = await hiddenCategoryIds();
    if (!product || hidden.some((id) => id.equals(product.category._id))) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
};

exports.parseProductQuery = parseProductQuery; // exported for the tests
