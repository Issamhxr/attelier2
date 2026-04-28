const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const {
  validateLogin,
  validateRegister,
  validateForgotPassword,
  validateResetPassword,
  validateChangePassword,
} = require('../validators/userValidator');
const { uploadAvatar, handleUploadError } = require('../middleware/upload');

// Public
router.post('/register',              validateRegister,       ctrl.register);
router.post('/login',                 validateLogin,          ctrl.login);
router.post('/refresh-token',                                 ctrl.refreshToken);
router.post('/forgot-password',       validateForgotPassword, ctrl.forgotPassword);
router.post('/reset-password/:token', validateResetPassword,  ctrl.resetPassword);
router.get('/verify-email/:token',                            ctrl.verifyEmail);

// Protected
router.get ('/me',              protect, ctrl.getMe);
router.post('/logout',          protect, ctrl.logout);
router.put ('/update-profile',  protect,
  handleUploadError(uploadAvatar), ctrl.updateProfile);
router.put ('/change-password', protect, validateChangePassword, ctrl.changePassword);

module.exports = router;