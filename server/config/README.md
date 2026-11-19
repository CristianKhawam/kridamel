# server/config/

Setup code the app needs before it can start, for example the MongoDB connection.

**`db.js`** connects to MongoDB Atlas with Mongoose using `MONGODB_URI`. `server.js` calls it before starting, and the server stops with a clear message if the connection fails.

**Rules**
- Read values from `process.env`. Never hardcode a connection string or password.
- Every new variable also goes in `.env.example` (name only, no value) and in the README table.
