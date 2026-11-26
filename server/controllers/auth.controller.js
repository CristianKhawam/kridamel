const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const COOKIE_NAME = 'token';
const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000; // in milliseconds
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Cookie settings: httpOnly = page JavaScript cannot read it; secure = only over HTTPS (on Render).
const cookieOptions = () => ({
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
});

// Creates the signed login token (JWT) and stores it in the cookie.
function setLoginCookie(res, user) {
  const token = jwt.sign({ sub: String(user._id), role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.cookie(COOKIE_NAME, token, { ...cookieOptions(), maxAge: SEVEN_DAYS });
}

// Checks the registration data. Returns a list of { field, message } (empty = valid).
function validateRegister({ name, email, password, phone }) {
  const errors = [];
  if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 80) {
    errors.push({ field: 'name', message: 'must be 2 to 80 characters' });
  }
  if (typeof email !== 'string' || !EMAIL_PATTERN.test(email.trim())) {
    errors.push({ field: 'email', message: 'must be a valid email' });
  }
  if (typeof password !== 'string' || password.length < 8) {
    errors.push({ field: 'password', message: 'must be at least 8 characters' });
  }
  if (phone !== undefined && typeof phone !== 'string') {
    errors.push({ field: 'phone', message: 'must be text' });
  }
  return errors;
}

// POST /api/auth/register   { name, email, password, phone? }
exports.register = async (req, res, next) => {
  try {
    const body = req.body || {};
    const errors = validateRegister(body);
    if (errors.length) {
      return res.status(400).json({ error: 'Invalid registration data', details: errors });
    }

    const email = body.email.trim().toLowerCase();
    if (await User.exists({ email })) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    // We pick only the fields we accept. A "role" sent in the body is ignored,
    // so public registration always creates a customer.
    const user = await User.create({
      name: body.name.trim(),
      email,
      phone: body.phone,
      passwordHash: await bcrypt.hash(body.password, 10),
    });

    setLoginCookie(res, user);
    res.status(201).json({ user }); // toJSON in the model removes passwordHash
  } catch (err) {
    if (err.code === 11000) {
      // Two registrations with the same email at the same moment: the unique index stops the second one.
      return res.status(409).json({ error: 'An account with this email already exists' });
    }
    next(err);
  }
};

// POST /api/auth/login   { email, password }
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+passwordHash');
    // The same message for "unknown email" and "wrong password", so nobody can find out which emails exist.
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    setLoginCookie(res, user);
    res.json({ user });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/logout
exports.logout = (req, res) => {
  res.clearCookie(COOKIE_NAME, cookieOptions());
  res.status(204).end();
};

// GET /api/auth/me   (requireAuth runs first and sets req.user)
exports.me = (req, res) => {
  res.json({ user: req.user });
};

exports.validateRegister = validateRegister; // exported for the tests
