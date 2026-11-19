// GET /api/health
// Lets us (and Render) check that the server is up.
exports.getHealth = (req, res) => {
  res.json({ status: 'ok' });
};
