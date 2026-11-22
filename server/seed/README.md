# server/seed/

A script that fills the database with demo data: categories, brands, tags, products with variants, coupons and demo accounts.

| File | Does |
|---|---|
| `data.js` | The demo data as plain arrays: 3 categories + 10 subcategories, 6 brands, 3 tags, 30 products (119 variants, some low or out of stock), 3 users, 2 coupons |
| `seed.js` | Empties the collections, then inserts everything from `data.js` (passwords hashed with bcrypt) |

Run it with:

```bash
npm run seed
```

⚠️ It **deletes** the current data first. Everyone shares the same Atlas database, so tell the team before running it.

Product images are the placeholders in `public/images/` (one per top-level category).

**Rules**
- **Fictitious data only.** Demo customers use cartoon/anime character names (SpongeBob SquarePants, Ash Ketchum, Naruto Uzumaki) with joke addresses and `@example.com` emails. Brands are invented.
- Running it twice must not create duplicates (clear the collections first, then insert).
- Passwords are hashed with bcrypt, like real users.
- Demo login details go in the main README. They must never be a real password.
