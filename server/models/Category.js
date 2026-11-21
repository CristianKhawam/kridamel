const mongoose = require('mongoose');

// Top-level categories (Clothing, Electronics, Sports) have parent = null.
// Subcategories (Men, Phones, Fitness…) point to their parent category.
const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true }, // used in URLs
    description: { type: String, trim: true },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null, index: true },
    cardImageUrl: String,
    bannerImageUrl: String,
    themeColor: { type: String, match: [/^#[0-9a-fA-F]{6}$/, 'must be a hex colour like #1f6feb'] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Category', categorySchema);
