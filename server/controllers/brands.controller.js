const Brand = require('../models/Brand');

// GET /api/brands
// Active brands, used for the brand filter on the category page.
exports.listBrands = async (req, res, next) => {
  try {
    res.json(await Brand.find({ isActive: true }).sort({ name: 1 }).lean());
  } catch (err) {
    next(err);
  }
};
