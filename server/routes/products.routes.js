const express = require('express');
const { listProducts, getProduct } = require('../controllers/products.controller');

const router = express.Router();

router.get('/', listProducts); // GET /api/products        (public, with filters)
router.get('/:slug', getProduct); // GET /api/products/:slug (public)

module.exports = router;
