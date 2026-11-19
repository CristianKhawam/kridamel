# server/

The Express backend. It serves the pages in `public/` and the REST API under `/api`.

## How a request flows

```
Browser ──> routes/ ──> middleware/ ──> controllers/ ──> models/ ──> MongoDB
            (URL)       (auth, checks)  (logic)          (data)
                                            │
                                            └──> services/ (email, payment, prices)
```

| Folder | What goes there | File name |
|---|---|---|
| `config/` | Database connection and settings | `db.js` |
| `models/` | One Mongoose model per collection | `Product.js` (PascalCase, singular) |
| `routes/` | URL → middleware → controller. No logic | `products.routes.js` |
| `controllers/` | What each endpoint does | `products.controller.js` |
| `middleware/` | Code that runs before controllers | `requireAuth.js` |
| `services/` | Reusable logic not tied to one request | `emailService.js` |
| `seed/` | Script that fills the database with demo data | `seed.js` |

## Adding a new endpoint (follow the `/api/health` example)

1. **Model**: if it needs a new collection, add it in `models/`.
2. **Controller**: write the function in `controllers/<resource>.controller.js`.
3. **Route**: map the URL in `routes/<resource>.routes.js`.
4. **Mount**: register the router in `server.js`: `app.use('/api/<resource>', require('./routes/<resource>.routes'));`
5. **Test**: try the success case and at least one error case (400, 401, 403 or 404).

## Rules for everyone

- Errors always use the format `{ "error": "Message", "details": [...] }`.
- Money is stored and sent in **cents** (integers): `$24.99` → `2499`.
- Never trust prices, totals, user IDs or roles sent by the browser. Read them from the database or the session.
- Secrets only come from `process.env` (the `.env` file). Never write them in code.
