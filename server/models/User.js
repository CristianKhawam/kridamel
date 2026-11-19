const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  label: { type: String, trim: true }, // e.g. "Home"
  line1: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  province: { type: String, required: true, trim: true },
  postalCode: { type: String, required: true, trim: true },
  isDefault: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
    email: {
      type: String,
      required: true,
      unique: true, // creates a unique index: two users cannot share an email
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'is not a valid email'],
    },
    // select: false = not loaded unless a query asks for it with .select('+passwordHash')
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    phone: { type: String, trim: true },
    addresses: [addressSchema],
    passwordReset: {
      type: { tokenHash: String, expiresAt: Date },
      select: false,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
    toJSON: {
      // Safety net: even if a query loaded them, these fields never reach the browser.
      transform(doc, ret) {
        delete ret.passwordHash;
        delete ret.passwordReset;
        delete ret.__v;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model('User', userSchema);
