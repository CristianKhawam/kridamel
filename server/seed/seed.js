// Resets the database and fills it with fictitious demo data.
// Run with: npm run seed
// WARNING: it DELETES the current users, categories, brands, tags, products and coupons first.
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const User = require('../models/User');
const Category = require('../models/Category');
const Brand = require('../models/Brand');
const Tag = require('../models/Tag');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const data = require('./data');

// "Classic Flannel Shirt" → "classic-flannel-shirt"
const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

async function seed() {
  await connectDB();

  // 1. Empty every collection and make sure the unique indexes exist.
  //    Deleting first is what makes running the seed twice safe (no duplicates).
  for (const Model of [User, Category, Brand, Tag, Product, Coupon]) {
    await Model.deleteMany({});
    await Model.syncIndexes();
  }

  // 2. Categories: first the 3 top-level ones, then their subcategories pointing to them.
  const subcategoryToTop = {}; // e.g. { men: 'clothing' }, used to pick the product image
  const subcategoryIds = {};
  for (const c of data.categories) {
    const image = `/images/${c.slug}.svg`;
    const top = await Category.create({
      name: c.name, slug: c.slug, description: c.description, themeColor: c.themeColor,
      cardImageUrl: image, bannerImageUrl: image,
    });
    for (const [name, slug] of c.subcategories) {
      const sub = await Category.create({ name, slug, parent: top._id, themeColor: c.themeColor, cardImageUrl: image });
      subcategoryIds[slug] = sub._id;
      subcategoryToTop[slug] = c.slug;
    }
  }

  // 3. Brands and tags.
  const brands = await Brand.insertMany(data.brands.map((name) => ({ name })));
  const tags = await Tag.insertMany(data.tags);
  const brandId = (name) => brands.find((b) => b.name === name)._id;
  const tagId = (slug) => tags.find((t) => t.slug === slug)._id;

  // 4. Products.
  const products = data.products.map(
    ([name, sub, brand, price, salePrice, tagSlugs, isFeatured, soldCount, ratingAvg, variants, description]) => ({
      name,
      slug: slugify(name),
      description,
      category: subcategoryIds[sub],
      brand: brandId(brand),
      tags: tagSlugs.map(tagId),
      price,
      salePrice: salePrice || undefined,
      images: [`/images/${subcategoryToTop[sub]}.svg`],
      variants,
      isFeatured,
      soldCount,
      ratingAvg,
      ratingCount: Math.round(soldCount / 4),
    })
  );
  await Product.insertMany(products);

  // 5. Demo users, with hashed passwords (never store the plain password).
  for (const { password, ...user } of data.users) {
    await User.create({ ...user, passwordHash: await bcrypt.hash(password, 10) });
  }

  // 6. Coupons.
  await Coupon.insertMany(data.coupons);

  console.log(
    `Seed done: ${await Category.countDocuments()} categories, ${brands.length} brands, ${tags.length} tags, ` +
      `${products.length} products, ${data.users.length} users, ${data.coupons.length} coupons.`
  );
}

seed()
  .catch((err) => {
    console.error('Seed failed:', err.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
