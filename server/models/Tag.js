const mongoose = require('mongoose');

// Labels shown on products, e.g. "New Arrival", "Best Seller", "Sale".
const tagSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
});

module.exports = mongoose.model('Tag', tagSchema);
