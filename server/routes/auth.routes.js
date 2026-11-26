const express = require('express');
const { register, login, logout, me, demoProfiles } = require('../controllers/auth.controller');
const { requireAuth } = require('../middleware/requireAuth');

const router = express.Router();

router.get('/demo-profiles', demoProfiles); // GET  /api/auth/demo-profiles (public)
router.post('/register', register); // POST /api/auth/register (public)
router.post('/login', login); // POST /api/auth/login    (public)
router.post('/logout', logout); // POST /api/auth/logout   (clears the cookie)
router.get('/me', requireAuth, me); // GET  /api/auth/me       (logged in only)

module.exports = router;
