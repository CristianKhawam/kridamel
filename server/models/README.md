# server/models/

One Mongoose model per MongoDB collection. The fields follow the database schema the team agreed on.

**Naming:** PascalCase and singular, for example `User.js`, `Product.js`, `Order.js`.

| Model | Collection | Notes |
|---|---|---|
| `User.js` | users | Unique email, role `customer` / `admin`, `passwordHash` hidden (`select: false` + removed from JSON) |
| `Category.js` | categories | Top-level categories have `parent: null`; subcategories point to their parent. Unique `slug`, `themeColor` |
| `Brand.js` | brands | Fictitious brands, unique name |
| `Tag.js` | tags | New Arrival, Best Seller, Sale |
| `Product.js` | products | Price in cents, optional `salePrice` lower than `price`, embedded `variants` with their own `stock`, unique SKU |

Tests: `models.test.js` checks the validation rules with `validate()`, without a database (`npm test`).

```js
// Example of a small model
const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true } // adds createdAt and updatedAt
);

module.exports = mongoose.model('Brand', brandSchema);
```

**Rules**
- Put validation in the schema (`required`, `min`, `enum`, `unique`, `match`) so bad data cannot be saved.
- Money fields are whole numbers in cents.
- Never return `passwordHash` to the browser.
- Models only describe data. Business logic goes in controllers or services.
