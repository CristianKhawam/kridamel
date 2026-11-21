const mongoose = require('mongoose');

// Connects to MongoDB Atlas using the MONGODB_URI from .env (or from Render's settings).
// If it cannot connect, the server stops with a clear message instead of running without a database.
async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI is missing. Add it to your .env file (see .env.example).');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log(`MongoDB connected (database: ${mongoose.connection.name})`);
  } catch (err) {
    console.error('Could not connect to MongoDB:', err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
