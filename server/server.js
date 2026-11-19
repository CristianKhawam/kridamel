const path = require('path');
const express = require('express');

const healthRoutes = require('./routes/health.routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// The store lives in public/customer/, so the site root opens it.
app.get('/', (req, res) => res.redirect('/customer/'));
app.use(express.static(path.join(__dirname, '..', 'public')));

// API routes: one router per resource, mounted under /api/<resource>.
app.use('/api/health', healthRoutes);

// Unknown API routes return JSON, not the HTML page.
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
