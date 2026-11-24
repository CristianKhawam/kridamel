const mongoose = require('mongoose');

// Prices are stored in cents (whole numbers) to avoid rounding errors: $24.99 → 2499.
// Stock is also a whole number.
const wholeNumber = { validator: Number.isInteger, message: 'must be a whole number' };

// A variant is one buyable version of the product, e.g. size M / Black.
// Stock is counted per variant. Variants live inside the product (embedded).
const variantSchema = new mongoose.Schema({
  sku: { type: String, required: true, trim: true, uppercase: true },
  attributes: {
    size: { type: String, trim: true },
    color: { type: String, trim: true },
  },
  stock: { type: Number, required: true, min: 0, default: 0, validate: wholeNumber },
  lowStockThreshold: { type: Number, min: 0, default: 5 },
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, trim: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true, index: true },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag', index: true }],
    price: { type: Number, required: true, min: 1, validate: wholeNumber }, // cents
    salePrice: {
      type: Number, // cents, optional
      min: 1,
      validate: [
        wholeNumber,
        {
          // A sale price only makes sense if it is lower than the regular price.
          validator(value) { return value < this.price; },
          message: 'must be lower than the regular price',
        },
      ],
    },
    images: [String], // URLs; the first one is the main image
    variants: {
      type: [variantSchema],
      validate: { validator: (list) => list.length > 0, message: 'needs at least one variant' },
    },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    ratingAvg: { type: Number, min: 0, max: 5, default: 0 },
    ratingCount: { type: Number, min: 0, default: 0 },
    soldCount: { type: Number, min: 0, default: 0 },
    // The price the customer pays now: the sale price if there is one, otherwise the price.
    // Filled automatically below; the catalog API filters and sorts by it.
    currentPrice: { type: Number, index: true },
  },
  { timestamps: true }
);

// Before every save/create/insertMany, keep currentPrice up to date.
// (updateOne/findOneAndUpdate skip this hook, so admin edits should use save().)
productSchema.pre('validate', function () {
  this.currentPrice = this.salePrice ?? this.price;
});

// Two variants (in any product) cannot share a SKU.
productSchema.index({ 'variants.sku': 1 }, { unique: true });

module.exports = mongoose.model('Product', productSchema);
