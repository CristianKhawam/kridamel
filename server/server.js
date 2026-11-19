// Load the .env file into process.env (built into Node, no package needed).
// On Render there is no .env file: the variables are set in its dashboard instead.
try {
  process.loadEnvFile();
} catch (err) {
  if (err.code !== 'ENOENT') throw err; // ENOENT = no .env file, which is fine
}

const path = require('path');
const express = require('express');

const healthRoutes = require('./routes/health.routes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Read JSON request bodies into req.body.
app.use(express.json());

// The store lives in public/customer/, so the site root opens it.
app.get('/', (req, res) => res.redirect('/customer/'));
app.use(express.static(path.join(__dirname, '..', 'public')));

// API routes: one router per resource, mounted under /api/<resource>.
app.use('/api/health', healthRoutes);

// Unknown API routes return 404 JSON, not the HTML page.
app.use('/api', notFound);

// Any other unknown address (a page) shows a friendly "Page not found" page.
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '..', 'public', '404.html'));
});

// Central error handler: always the last app.use().
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
