// Runs when no /api route matched the request.
// Returns JSON instead of Express's default HTML "Cannot GET" page.
module.exports = function notFound(req, res) {
  res.status(404).json({ error: 'Not found' });
};
