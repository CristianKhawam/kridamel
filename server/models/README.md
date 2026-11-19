# server/models/

One Mongoose model per MongoDB collection. The fields follow the database schema the team agreed on.

**Naming:** PascalCase and singular, for example `User.js`, `Product.js`, `Order.js`.

```js
// server/models/Brand.js (example)
const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    logoUrl: String,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true } // adds createdAt and updatedAt
);

module.exports = mongoose.model('Brand', brandSchema);
```

**Rules**
- Put validation in the schema (`required`, `min`, `enum`, `unique`) so bad data cannot be saved.
- Money fields are integers in cents.
- Never return `passwordHash` to the browser. Use `select: false` on that field.
- Models only describe data. Business logic goes in controllers or services.
