const crypto = require('crypto');
const jwt    = require('jsonwebtoken');
const User   = require('../models/User');
const {
  sendEmail,
  sendPasswordResetEmail,
} = require('../services/emailService');

/* ══════════════════════════════════════════
   HELPER — Hash a token with SHA-256
══════════════════════════════════════════ */
const hashToken = (token) =>
  crypto.createHash('sha256').update(token).digest('hex');

/* ══════════════════════════════════════════
   HELPER — Send tokens in response
══════════════════════════════════════════ */
const sendTokenResponse = async (user, statusCode, res, message = 'Success.') => {
  const accessToken  = user.getSignedJwtToken();
  const refreshToken = user.getRefreshToken();

  // Store hashed refresh token in DB (not plain text)
  user.refreshToken       = hashToken(refreshToken);
  user.refreshTokenExpire = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
  user.lastLogin          = new Date();

  await user.save({ validateBeforeSave: false });

  return res.status(statusCode).json({
    success: true,
    message,
    accessToken,
    refreshToken,
    user: {
      id:     user._id,
      nom:    user.nom,
      prenom: user.prenom,
      email:  user.email,
      role:   user.role,
      actif:  user.actif,
      avatar: user.avatar,
    },
  });
};

/* ══════════════════════════════════════════
   POST /api/auth/register
══════════════════════════════════════════ */
exports.register = async (req, res, next) => {
  try {
    const { nom, prenom, email, password, telephone,
            language, level, section } = req.body;

    // Role is always forced to 'etudiant' on self-registration
    const role = 'etudiant';

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(409).json({
        success: false,
        message: 'This email is already in use.',
      });
    }

    const user = await User.create({
      nom:       nom       || '',
      prenom:    prenom    || '',
      email:     email.toLowerCase(),
      password,
      role,
      telephone: telephone || '',
      language:  language  || '',
      level:     level     || '',
      section:   section   || 'To be assigned',
      actif:     false, // requires admin activation
    });

    return sendTokenResponse(user, 201, res, 'Account created. Awaiting admin activation.');
  } catch (err) {
    next(err);
  }
};

/* ══════════════════════════════════════════
   POST /api/auth/login
══════════════════════════════════════════ */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    if (!user.actif) {
      return res.status(403).json({
        success: false,
        message: 'Account disabled or pending validation. Please contact the administrator.',
      });
    }

    return sendTokenResponse(user, 200, res, 'Login successful.');
  } catch (err) {
    next(err);
  }
};

/* ══════════════════════════════════════════
   POST /api/auth/refresh-token
══════════════════════════════════════════ */
exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ success: false, message: 'Refresh token required.' });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token.',
        code: 'REFRESH_TOKEN_INVALID',
      });
    }

    const hashed = hashToken(refreshToken);

    const user = await User.findOne({
      _id:                decoded.id,
      refreshToken:       hashed,
      refreshTokenExpire: { $gt: new Date() },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Session expired. Please log in again.',
        code: 'REFRESH_TOKEN_EXPIRED',
      });
    }

    if (!user.actif) {
      return res.status(403).json({ success: false, message: 'Account disabled.' });
    }

    return sendTokenResponse(user, 200, res, 'Token refreshed.');
  } catch (err) {
    next(err);
  }
};

/* ══════════════════════════════════════════
   POST /api/auth/logout
══════════════════════════════════════════ */
exports.logout = async (req, res, next) => {
  try {
    if (req.user) {
      await User.findByIdAndUpdate(req.user.id, {
        refreshToken:       null,
        refreshTokenExpire: null,
      });
    }
    return res.json({ success: true, message: 'Logged out successfully.' });
  } catch (err) {
    next(err);
  }
};

/* ══════════════════════════════════════════
   GET /api/auth/me
══════════════════════════════════════════ */
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    return res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

/* ══════════════════════════════════════════
   PUT /api/auth/update-profile
══════════════════════════════════════════ */
exports.updateProfile = async (req, res, next) => {
  try {
    const { nom, prenom, telephone, adresse } = req.body;
    const updates = {};
    if (nom)       updates.nom       = nom.trim();
    if (prenom)    updates.prenom    = prenom.trim();
    if (telephone) updates.telephone = telephone.trim();
    if (adresse)   updates.adresse   = adresse.trim();
    if (req.file)  updates.avatar    = `/uploads/images/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      req.user.id, updates, { new: true, runValidators: true }
    );

    return res.json({ success: true, message: 'Profile updated.', user });
  } catch (err) {
    next(err);
  }
};

/* ══════════════════════════════════════════
   PUT /api/auth/change-password
══════════════════════════════════════════ */
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPwd, newPwd } = req.body;
    const user = await User.findById(req.user.id).select('+password');

    const isMatch = await user.matchPassword(currentPwd);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
    }

    user.password           = newPwd;
    user.refreshToken       = null;
    user.refreshTokenExpire = null;
    await user.save();

    return res.json({ success: true, message: 'Password changed successfully.' });
  } catch (err) {
    next(err);
  }
};

/* ══════════════════════════════════════════
   POST /api/auth/forgot-password
══════════════════════════════════════════ */
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    // Always return same message (don't reveal if email exists)
    const successMsg = 'If this email is linked to an account, a reset link has been sent.';

    if (!user) {
      return res.json({ success: true, message: successMsg });
    }

    const rawToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${rawToken}`;

    try {
      await sendPasswordResetEmail({
        to:       user.email,
        name:     user.prenom || user.nom || 'User',
        resetUrl,
      });
    } catch (emailErr) {
      console.error('⚠️  Email error:', emailErr.message);
      user.resetPasswordToken  = null;
      user.resetPasswordExpire = null;
      await user.save({ validateBeforeSave: false });
      return res.status(500).json({
        success: false,
        message: 'Error sending the email. Please try again later.',
      });
    }

    return res.json({
      success: true,
      message: successMsg,
      ...(process.env.NODE_ENV === 'development' && { resetUrl }),
    });
  } catch (err) {
    next(err);
  }
};

/* ══════════════════════════════════════════
   POST /api/auth/reset-password/:token
══════════════════════════════════════════ */
exports.resetPassword = async (req, res, next) => {
  try {
    const { password } = req.body;

    const hashed = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken:  hashed,
      resetPasswordExpire: { $gt: Date.now() },
    }).select('+resetPasswordToken +resetPasswordExpire');

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired token.' });
    }

    user.password            = password;
    user.resetPasswordToken  = null;
    user.resetPasswordExpire = null;
    user.refreshToken        = null;
    user.refreshTokenExpire  = null;
    await user.save();

    return sendTokenResponse(user, 200, res, 'Password reset successfully.');
  } catch (err) {
    next(err);
  }
};

/* ══════════════════════════════════════════
   GET /api/auth/verify-email/:token
══════════════════════════════════════════ */
exports.verifyEmail = async (req, res, next) => {
  try {
    const hashed = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({ emailVerificationToken: hashed })
      .select('+emailVerificationToken');

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid verification token.' });
    }

    user.isEmailVerified        = true;
    user.emailVerificationToken = null;
    await user.save({ validateBeforeSave: false });

    return res.json({ success: true, message: 'Email verified successfully.' });
  } catch (err) {
    next(err);
  }
};