# public/admin/

The admin panel. URL: `/admin/<page>.html`. The dashboard is `/admin/`.

Same structure as `customer/`: copy `_template.html` and follow the steps in `public/README.md`. Header and footer come from `js/layout.js`.

**Planned pages** (from the wireframes)

| Page | File |
|---|---|
| Dashboard | `index.html` ✔ (placeholder) |
| Products / product form | `products.html`, `product-edit.html` |
| Categories | `categories.html` |
| Brands and tags | `brands-tags.html` |
| Coupons | `coupons.html` |
| Inventory | `inventory.html` |
| Orders / order detail | `orders.html`, `order-detail.html` |
| Reports (printable) | `reports.html` |

## Security

Hiding these pages is **not** the protection. Every `/api/admin/...` route is protected on the server with `requireAuth` and `requireRole('admin')`, so a customer gets `403` even if they open the page.

Each admin page should still call `GET /api/auth/me` when it loads and send non-admins to `/customer/login.html`. That only improves the experience; it is not security.
