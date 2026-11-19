# server/middleware/

Functions with the shape `(req, res, next)` that run **before** a controller. They either stop the request with an error or call `next()` to continue.

**Planned files**

| File | Does | Responds with |
|---|---|---|
| `requireAuth.js` | Reads the session cookie and sets `req.user` | `401` if not logged in |
| `requireRole.js` | Checks `req.user.role` | `403` if the role is wrong |
| `errorHandler.js` | Catches errors passed to `next(err)` | `500` with no stack trace |

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
