const express = require('express');
const { listBrands } = require('../controllers/brands.controller');

const router = express.Router();

router.get('/', listBrands); // GET /api/brands (public)

module.exports = router;
