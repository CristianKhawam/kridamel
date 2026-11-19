# KRIDAMEL – Department Store E-Commerce Platform

**SODV1251 – Web Programming Basics and Node.js · Final Group Project · Fall 2026**

A full-stack department store for the Canadian market (English, CAD). Customers browse a catalog of clothing, electronics and sports products, choose variants (size and colour), manage a cart and place simulated orders for pickup or delivery. Administrators manage the catalog, inventory, orders and sales reports from a separate panel.

The instructor approved this project as an adaptation of **Option 1 (restaurant / point of sale)**. It keeps the same responsibilities: a customer interface, a merchant/admin interface, inventory, orders, reports, authentication, authorization and automated emails.

Store name: **KRIDAMEL** · *Your World. Your Store.* The name blends the team's names: **Cri**stian **K**hawam (KRI), **D**im**a** Hadla (DA) and Arnaud Ar**mel** (MEL).

## Team

| Member | GitHub |
|---|---|
| Cristian Khawam | [@CristianKhawam](https://github.com/CristianKhawam) |
| Dima Hadla | [@dima-hadla](https://github.com/dima-hadla) |
| Arnaud Armel | [@ArnaudArmel](https://github.com/ArnaudArmel) |

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | HTML, CSS, vanilla JavaScript (responsive) |
| Backend | Node.js + Express, custom REST API |
| Database | MongoDB Atlas (Mongoose) |
| Auth | bcrypt password hashing, JWT in an httpOnly cookie, role-based access (customer / admin) |
| Email | HTTP email API (Brevo or Resend) |
| Deployment | Render (web service) + MongoDB Atlas (database) |

## Planning

Work is organized with GitHub **Issues** and **Milestones** (one milestone per checkpoint). Pick an issue, assign yourself, and work on a branch for it.

## Project structure

Every folder has its own `README.md` that explains what goes there, how to name files, and an example. **Read it before adding a file to that folder**, so the project keeps one consistent structure.

```
.
├── server/                  # Backend (see server/README.md for how a request flows)
│   ├── server.js            # Express app entry point: middleware and route mounting
│   ├── config/              # DB connection and settings
│   ├── models/              # Mongoose models: User.js, Product.js, Order.js …
│   ├── routes/              # URL → controller: products.routes.js …
│   ├── controllers/         # Endpoint logic: products.controller.js …
│   ├── middleware/          # requireAuth, requireRole, error handler
│   ├── services/            # Email, simulated payment, pricing/tax
│   └── seed/                # Demo data script
├── public/                  # Frontend (see public/README.md)
│   ├── css/base.css         # Styles used by both apps
│   ├── js/api.js            # API helper used by both apps
│   ├── customer/            # The store: pages, _template.html, css/, js/layout.js …
│   └── admin/               # The admin panel: same structure as customer/
├── .github/                 # Pull request template
├── .env.example             # Environment variable names (no values)
└── package.json
```

`/api/health` is a complete working example of the pattern: `routes/health.routes.js` → `controllers/health.controller.js`, called from the home page by `public/customer/js/index.js`.

**Adding a feature, end to end:** model → controller → route → mount in `server.js` → page from `customer/_template.html` or `admin/_template.html` → page script that calls `api()`.

## Division of responsibilities (proposed)

The final split is still being discussed. Every member reviews pull requests and must be able to explain a request end-to-end (browser → API → database → browser).

| Area | Scope | Lead |
|---|---|---|
| Customer frontend | Home, navigation, catalog, search/filters, product detail, cart, checkout, account screens | TBD |
| Backend / API | Express, REST API, auth, validation, order and inventory logic, emails | TBD |
| Database & Admin | Mongoose models, seed data, admin dashboard, catalog/inventory/order/report screens | TBD |

## Setup

Requirements: Node.js 20 or newer, and a MongoDB Atlas connection string.

```bash
npm install            # first time only (and after someone adds a package)
cp .env.example .env   # first time only, then fill in the values
npm run dev            # starts everything: pages + API
```

The store runs at `http://localhost:3000` and the admin panel at `http://localhost:3000/admin/`. Health check: `GET /api/health`.

| Command | Use it for |
|---|---|
| `npm run dev` | Working on the project. **nodemon** restarts the server every time you save a file in `server/`. Changes in `public/` only need a browser refresh. |
| `npm start` | Running it like production (Render uses this). No auto-restart. |

Always open the pages through `http://localhost:3000`. Opening the HTML file directly or with the VS Code preview will not load the header, footer, styles or API.

### Environment variables

| Name | Purpose |
|---|---|
| `PORT` | Server port (Render sets this automatically) |
| `NODE_ENV` | `development` or `production` |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret used to sign session tokens |
| `APP_BASE_URL` | Public URL, used in email links |
| `EMAIL_API_KEY` | Email provider API key |
| `EMAIL_FROM` | Sender address for automated emails |

Secrets are never committed. `.env` is in `.gitignore`.

## Demo accounts

Will be added at Checkpoint 2 (fictitious data only).

## Deployment

URL: _pending (Checkpoint 2)_

## Workflow

- Every task is a GitHub Issue with a description, acceptance criteria and a milestone.
- Work happens on a branch per issue, for example `feature/12-order-api`.
- Pull requests use the template in `.github/pull_request_template.md`, link their issue with `Closes #n`, and are reviewed by another member before merging.
