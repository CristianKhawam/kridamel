const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Reads one cookie from the request header: "theme=dark; token=abc" → readCookie(req, 'token') = "abc".
function readCookie(req, name) {
  const pair = (req.headers.cookie || '').split(';').map((c) => c.trim()).find((c) => c.startsWith(`${name}=`));
  if (!pair) return undefined;
  try {
    return decodeURIComponent(pair.slice(name.length + 1));
  } catch {
    return undefined; // a broken cookie value counts as "no cookie"
  }
}

// Lets the request continue only if it has a valid login cookie. Sets req.user.
// Responds 401 when there is no cookie, the token is expired or fake, or the user no longer exists.
async function requireAuth(req, res, next) {
  try {
    const token = readCookie(req, 'token');
    if (!token) {
      return res.status(401).json({ error: 'Not logged in' });
    }

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    } catch {
      return res.status(401).json({ error: 'Not logged in' }); // expired or tampered token
    }

    // Load the user again so a deleted user or a changed role takes effect immediately.
    const user = await User.findById(payload.sub);
    if (!user) {
      return res.status(401).json({ error: 'Not logged in' });
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = { requireAuth, readCookie };
