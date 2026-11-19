# server/config/

Setup code the app needs before it can start, for example the MongoDB connection.

**Planned file:** `db.js`, which connects to MongoDB Atlas with Mongoose.

```js
// server/config/db.js (example)
const mongoose = require('mongoose');

module.exports = async function connectDB() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('MongoDB connected');
};
```

**Rules**
- Read values from `process.env`. Never hardcode a connection string or password.
- Every new variable also goes in `.env.example` (name only, no value) and in the README table.
