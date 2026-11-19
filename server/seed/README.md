# server/seed/

A script that fills the database with demo data: categories, brands, tags, products with variants, coupons and demo accounts.

**Planned file:** `seed.js`. When it exists, add this script to `package.json` and run it with `npm run seed`:

```json
"seed": "node server/seed/seed.js"
```

**Rules**
- **Fictitious data only.** Demo customers use cartoon/anime character names (SpongeBob SquarePants, Ash Ketchum, Naruto Uzumaki) with joke addresses and `@example.com` emails. Brands are invented.
- Running it twice must not create duplicates (clear the collections first, then insert).
- Passwords are hashed with bcrypt, like real users.
- Demo login details go in the main README. They must never be a real password.
