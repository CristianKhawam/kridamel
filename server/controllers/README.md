# server/controllers/

What each endpoint actually does: read the request, validate it, talk to the models and services, and send the response.

**Naming:** `<resource>.controller.js`. Function names are a verb plus a noun: `listProducts`, `getProduct`, `createOrder`, `updateOrderStatus`.

Working example: [`health.controller.js`](health.controller.js).

```js
// server/controllers/products.controller.js (example)
const Product = require('../models/Product');

// GET /api/products/:slug
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    next(err); // Express 4 does not catch errors in async functions by itself
  }
};
```

**Rules**
- Validate input first and return `400` with `{ error, details }` when it is invalid.
- Use `req.user` (set by `requireAuth`) for the logged-in user. Never take a user ID or role from `req.body`.
- Read prices and stock from the database, never from the request.
- Wrap async code in `try/catch` and call `next(err)` for unexpected errors.
