# server/middleware/

Functions with the shape `(req, res, next)` that run **before** a controller. They either stop the request with an error or call `next()` to continue.

**Files**

| File | Does | Responds with |
|---|---|---|
| `notFound.js` ✔ | Runs when no `/api` route matched. (Unknown **pages** get `public/404.html` instead, see `server.js`) | `404 { "error": "Not found" }` |
| `errorHandler.js` ✔ | Catches errors thrown or passed to `next(err)`. Registered last in `server.js` | `500 { "error": "Internal server error" }` with no stack trace; `400` for invalid JSON; the error's own status for expected errors |
| `requireAuth.js` ✔ | Reads the login cookie, checks the JWT and sets `req.user` | `401 { "error": "Not logged in" }` |
| `requireRole.js` | Checks `req.user.role` | `403` if the role is wrong |

To send an expected error from a controller, pass it to the error handler with a status:

```js
return next(Object.assign(new Error('Product not found'), { status: 404 }));
```

Tests live next to the file (`errorHandler.test.js`) and run with `npm test`.

```js
// server/middleware/requireRole.js (example)
exports.requireRole = (role) => (req, res, next) => {
  if (!req.user || req.user.role !== role) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
};
```

**Rules**
- Permissions are always checked here on the server. Hiding a button in the page is not security.
- Ownership checks ("is this your order?") go in the controller, because they need the record.
