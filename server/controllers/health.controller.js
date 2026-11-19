const mongoose = require('mongoose');

// GET /api/health
// Lets us (and Render) check that the server is up and connected to the database.
exports.getHealth = (req, res) => {
  const dbConnected = mongoose.connection.readyState === 1; // 1 = connected
  res.json({ status: 'ok', database: dbConnected ? 'connected' : 'disconnected' });
};
