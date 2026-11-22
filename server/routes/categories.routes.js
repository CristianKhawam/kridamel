const express = require('express');
const { listCategories, getCategory } = require('../controllers/categories.controller');

const router = express.Router();

router.get('/', listCategories); // GET /api/categories        (public)
router.get('/:slug', getCategory); // GET /api/categories/:slug (public)

module.exports = router;
