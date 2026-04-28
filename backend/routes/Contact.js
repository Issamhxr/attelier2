const express = require('express');
const router  = express.Router();
const { body, validationResult } = require('express-validator');
const { sendContactAdminEmail, sendContactConfirmationEmail } = require('../services/emailService');
const User = require('../models/User');

/* ══════════════════════════════════════════
   VALIDATION
══════════════════════════════════════════ */
const validateContact = [
  body('name')
    .notEmpty().withMessage('Full name is required.')
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters.'),
  body('email')
    .isEmail().withMessage('Invalid email address.')
    .normalizeEmail(),
  body('message')
    .notEmpty().withMessage('Message is required.')
    .isLength({ min: 10, max: 1000 }).withMessage('Message must be between 10 and 1000 characters.'),
];

/* ══════════════════════════════════════════
   POST /api/contact
   Public — no auth required
══════════════════════════════════════════ */
router.post('/', validateContact, async (req, res) => {
  // Validate inputs
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: 'Invalid data.',
      errors:  errors.array().map(e => ({ field: e.path, message: e.msg })),
    });
  }

  const { name, email, message } = req.body;

  try {
    // Find admin email(s) from DB
    const admins = await User.find({ role: 'admin', actif: true }).select('email');

    if (!admins.length) {
      console.warn('⚠️  No active admin found to receive contact request.');
      // Still return success to avoid revealing system info
      return res.json({
        success: true,
        message: 'Your request has been received. The administrator will contact you shortly.',
      });
    }

    // Send email to all admins
    await Promise.all(
      admins.map(admin =>
        sendContactAdminEmail({
          adminEmail:  admin.email,
          senderName:  name,
          senderEmail: email,
          message,
        })
      )
    );

    // Send confirmation to the requester
    await sendContactConfirmationEmail({ to: email, name });

    return res.json({
      success: true,
      message: 'Your request has been received. The administrator will contact you shortly.',
    });
  } catch (err) {
    console.error('❌ Contact route error:', err.message);
    return res.status(500).json({
      success: false,
      message: 'An error occurred. Please try again later.',
    });
  }
});

module.exports = router;