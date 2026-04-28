const jwt  = require('jsonwebtoken');
const User = require('../models/User');

/* ══════════════════════════════════════════
   protect — Verifies JWT and loads req.user
   Supports: Authorization: Bearer <token>
             Cookie: token=<token>
══════════════════════════════════════════ */
exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.token) {
    // Works only when cookie-parser is mounted in server.js (it is ✅)
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Token missing.',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found. Invalid token.',
      });
    }

    if (!user.actif) {
      return res.status(403).json({
        success: false,
        message: 'Account disabled. Please contact the administrator.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired. Please log in again.',
        code: 'TOKEN_EXPIRED',
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Invalid token.',
    });
  }
};

/* ══════════════════════════════════════════
   authorize — Restricts access by role(s)
   Usage: router.get('/admin-only', protect, authorize('admin'), handler)
══════════════════════════════════════════ */
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Role '${req.user.role}' is not authorized for this resource.`,
      });
    }
    next();
  };
};

/* ══════════════════════════════════════════
   optionalAuth — Loads req.user if token present
   Does NOT block the request if token is absent
══════════════════════════════════════════ */
exports.optionalAuth = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
  } catch (_) {
    // Invalid token → continue without user
  }
  next();
};