// Central error handler. Express calls it when a route throws or calls next(err).
// It must be registered LAST in server.js and must keep 4 parameters, so Express knows it handles errors.
module.exports = function errorHandler(err, req, res, next) {
  // If part of the response was already sent, let Express close the connection.
  if (res.headersSent) return next(err);

  // The request body was not valid JSON (thrown by express.json()).
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON in request body' });
  }

  const status = err.status || err.statusCode || 500;

  // Unexpected error: log the details on the server, but never send them to the browser.
  if (status >= 500) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }

  // Expected error created on purpose by our code, for example: Object.assign(new Error('Product not found'), { status: 404 })
  res.status(status).json({ error: err.message, ...(err.details && { details: err.details }) });
};
