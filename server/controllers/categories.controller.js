const Category = require('../models/Category');

// GET /api/categories
// Active categories as a tree: [{ ...Clothing, children: [Men, Women, …] }, …]
exports.listCategories = async (req, res, next) => {
  try {
    const all = await Category.find({ isActive: true }).sort({ _id: 1 }).lean(); // _id order = creation order
    const tree = all
      .filter((c) => !c.parent)
      .map((top) => ({ ...top, children: all.filter((c) => String(c.parent) === String(top._id)) }));
    res.json(tree);
  } catch (err) {
    next(err);
  }
};

// GET /api/categories/:slug
// One category with its subcategories (and its parent, if it is a subcategory).
exports.getCategory = async (req, res, next) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug, isActive: true })
      .populate('parent', 'name slug themeColor')
      .lean();
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    category.children = await Category.find({ parent: category._id, isActive: true }).sort({ _id: 1 }).lean();
    res.json(category);
  } catch (err) {
    next(err);
  }
};
