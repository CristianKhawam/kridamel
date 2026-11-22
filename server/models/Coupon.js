const mongoose = require('mongoose');

// Discount codes. type "percent": value 10 = 10% off. type "fixed": value 500 = $5.00 off (cents).
const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    type: { type: String, enum: ['percent', 'fixed'], required: true },
    value: { type: Number, required: true, min: 1 },
    minSubtotal: { type: Number, min: 0, default: 0 }, // cents
    expiresAt: Date,
    maxUses: { type: Number, min: 1 },
    usedCount: { type: Number, min: 0, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Coupon', couponSchema);
