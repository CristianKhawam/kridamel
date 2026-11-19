const express = require('express');
const { getHealth } = require('../controllers/health.controller');

const router = express.Router();

// Mounted in server.js at /api/health, so '/' here means GET /api/health.
router.get('/', getHealth);

module.exports = router;
