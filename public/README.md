# public/

The frontend: plain HTML, CSS and JavaScript. Express serves this folder as-is, so `public/customer/cart.html` opens at `http://localhost:3000/customer/cart.html`. The site root `/` redirects to `/customer/`.

The customer store and the admin panel have **the same structure**:

```
public/
├── css/base.css             # Used by BOTH apps: colours, fonts, header/footer, .btn, .card, .status
├── js/api.js                # Used by BOTH apps: api() to call the server + formatPrice()
├── customer/                # The store             → /customer/...
│   ├── index.html           # Home page
│   ├── _template.html       # Copy this to create a new customer page
│   ├── <page>.html          # product.html, cart.html, checkout.html …
│   ├── css/customer.css     # Store-only styles (category colours)
│   └── js/
│       ├── layout.js        # Header + footer of every customer page
│       ├── index.js         # Script of index.html (working example)
│       └── <page>.js        # One script per page, same name as its HTML
└── admin/                   # The admin panel       → /admin/...
    ├── index.html           # Dashboard
    ├── _template.html       # Copy this to create a new admin page
    ├── <page>.html          # products.html, orders.html, inventory.html …
    ├── css/admin.css        # Admin-only styles
    └── js/
        ├── layout.js        # Header + footer of every admin page
        └── <page>.js
```

## Header and footer are written once

Pages do **not** contain the menu or the footer. Each page has two empty tags:

```html
<header id="site-header" class="site-header"></header>
...
<footer id="site-footer" class="site-footer"></footer>
```

and `js/layout.js` fills them. To add a menu link or change the footer, edit **only** `customer/js/layout.js` (or `admin/js/layout.js`) and every page updates.

## Creating a new page (same steps for customer and admin)

1. Copy `customer/_template.html` (or `admin/_template.html`) to `<page-name>.html` in the same folder. Use lowercase with hyphens, for example `order-detail.html`.
2. Change the `<title>` and `<h1>`, and write the page content inside `<main>`.
3. Create `js/<page-name>.js` in the same app and point the last `<script>` tag to it.
4. Page-specific styles go at the bottom of that app's CSS file, in a section with the page name.
5. If the page should be in the menu, add the link in that app's `js/layout.js`.

Scripts load in this order on every page: `/js/api.js` → `layout.js` → the page script.

## Pattern for a page script

Working example: `customer/js/index.js`.

```js
// public/customer/js/products.js (example) for products.html
const statusEl = document.getElementById('status');
const contentEl = document.getElementById('content');

async function loadProducts() {
  statusEl.textContent = 'Loading…';
  try {
    const { items } = await api('/api/products');
    if (items.length === 0) {
      statusEl.textContent = 'No products found.';
      return;
    }
    for (const p of items) {
      const card = document.createElement('article');
      card.className = 'card';
      card.textContent = `${p.name} · ${formatPrice(p.price)}`;
      contentEl.append(card);
    }
    statusEl.textContent = '';
  } catch (err) {
    statusEl.textContent = err.message;
    statusEl.classList.add('error');
  }
}

loadProducts();
```

## Rules

- Something used by both apps goes in `public/css/` or `public/js/`. Something used by only one app goes in that app's own `css/` or `js/` folder.
- Always use paths that start with `/` (`/js/api.js`), so they work from any folder.
- Call the server through `api()`, not `fetch` directly. Prices arrive in cents: show them with `formatPrice()`.
- Put data from the API in the page with `textContent`, not `innerHTML`, so it cannot inject HTML.
- Use the CSS variables from `base.css` (`var(--color-accent)`, `var(--space)`) instead of typing colours by hand.
- Nothing that must be trusted lives here (prices, totals, permissions). The server decides; the page only shows the result.
- Show loading, empty and error states, and check every page on a phone width.
