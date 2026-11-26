// Load the .env file into process.env (built into Node, no package needed).
// On Render there is no .env file: the variables are set in its dashboard instead.
try {
  process.loadEnvFile();
} catch (err) {
  if (err.code !== 'ENOENT') throw err; // ENOENT = no .env file, which is fine
}

// The login tokens are signed with this secret: without it, nobody could log in.
if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is missing. Add it to your .env file (see .env.example).');
  process.exit(1);
}

const path = require('path');
const express = require('express');

const connectDB = require('./config/db');
const healthRoutes = require('./routes/health.routes');
const categoriesRoutes = require('./routes/categories.routes');
const productsRoutes = require('./routes/products.routes');
const brandsRoutes = require('./routes/brands.routes');
const authRoutes = require('./routes/auth.routes');
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
app.use('/api/categories', categoriesRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/brands', brandsRoutes);
app.use('/api/auth', authRoutes);

// Unknown API routes return 404 JSON, not the HTML page.
app.use('/api', notFound);

// Any other unknown address (a page) shows a friendly "Page not found" page.
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '..', 'public', '404.html'));
});

// Central error handler: always the last app.use().
app.use(errorHandler);

// Connect to the database first, then start accepting requests.
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
