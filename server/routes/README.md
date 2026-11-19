# server/routes/

Routers that connect a URL to its middleware and controller. **No logic here.** If a route needs more than one line, that code belongs in a controller.

**Naming:** `<resource>.routes.js`, for example `products.routes.js` or `orders.routes.js`.
Admin routes go in `routes/admin/` and are mounted under `/api/admin`.

Working example: [`health.routes.js`](health.routes.js), mounted in `server.js` at `/api/health`.

```js
// server/routes/products.routes.js (example)
const express = require('express');
const { listProducts, getProduct } = require('../controllers/products.controller');
const { requireAuth } = require('../middleware/requireAuth');
const { requireRole } = require('../middleware/requireRole');

const router = express.Router();

router.get('/', listProducts);        // GET /api/products         (public)
router.get('/:slug', getProduct);     // GET /api/products/:slug   (public)
// Protected example:
// router.post('/', requireAuth, requireRole('admin'), createProduct);

module.exports = router;
```

Then register it in `server.js`:

```js
app.use('/api/products', require('./routes/products.routes'));
```
