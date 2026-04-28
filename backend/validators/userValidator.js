const { body, param, query, validationResult } = require('express-validator');

/* ══════════════════════════════════════════
   HELPER — Return 422 if validation errors
══════════════════════════════════════════ */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: 'Invalid data.',
      errors:  errors.array().map(e => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

/* ══════════════════════════════════════════
   AUTH VALIDATORS
══════════════════════════════════════════ */
exports.validateLogin = [
  body('email')
    .isEmail().withMessage('Invalid email address.')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required.')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
  validate,
];

exports.validateRegister = [
  body('nom').optional().trim().isLength({ max: 50 }).withMessage('Last name too long (50 max).'),
  body('prenom').optional().trim().isLength({ max: 50 }).withMessage('First name too long (50 max).'),
  body('email')
    .isEmail().withMessage('Invalid email address.')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
  // FIX: role is intentionally NOT validated here — it is always forced to 'etudiant'
  // in the controller regardless of what the client sends
  validate,
];

exports.validateForgotPassword = [
  body('email')
    .isEmail().withMessage('Invalid email address.')
    .normalizeEmail(),
  validate,
];

exports.validateResetPassword = [
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
  validate,
];

exports.validateChangePassword = [
  body('currentPwd').notEmpty().withMessage('Current password is required.'),
  body('newPwd')
    .isLength({ min: 6 }).withMessage('New password must be at least 6 characters.')
    .custom((val, { req }) => {
      if (val === req.body.currentPwd) {
        throw new Error('New password must be different from the current one.');
      }
      return true;
    }),
  validate,
];

/* ══════════════════════════════════════════
   USER VALIDATORS (admin)
══════════════════════════════════════════ */
exports.validateCreateUser = [
  body('email')
    .isEmail().withMessage('Invalid email address.')
    .normalizeEmail(),
  body('role')
    .isIn(['admin', 'professeur', 'etudiant', 'parent', 'secretaire'])
    .withMessage('Invalid role.'),
  body('nom').optional().trim(),
  body('prenom').optional().trim(),
  body('telephone')
    .optional()
    .matches(/^[+\d\s()-]{6,20}$/).withMessage('Invalid phone number.'),
  validate,
];

exports.validateUpdateUser = [
  body('email').optional().isEmail().withMessage('Invalid email address.').normalizeEmail(),
  body('telephone')
    .optional()
    .matches(/^[+\d\s()-]{6,20}$/).withMessage('Invalid phone number.'),
  validate,
];

/* ══════════════════════════════════════════
   ABSENCE VALIDATORS
══════════════════════════════════════════ */
exports.validateAbsence = [
  body('studentId')
    .notEmpty().withMessage('Student ID is required.')
    .isMongoId().withMessage('Invalid student ID.'),
  body('date')
    .notEmpty().withMessage('Date is required.')
    .isISO8601().withMessage('Invalid date format (ISO 8601 required).'),
  body('session')
    .notEmpty().withMessage('Session is required.')
    .isIn(['Morning', 'Evening', 'Weekend']).withMessage('Invalid session.'),
  body('reason')
    .optional()
    .isIn(['Sick', 'Personal', 'Travel', 'Unknown']).withMessage('Invalid reason.'),
  validate,
];

/* ══════════════════════════════════════════
   PAYMENT VALIDATORS
══════════════════════════════════════════ */
exports.validatePayment = [
  body('amount')
    .notEmpty().withMessage('Amount is required.')
    .isFloat({ min: 0.01 }).withMessage('Invalid amount.'),
  body('due')
    .notEmpty().withMessage('Due date is required.')
    .isISO8601().withMessage('Invalid date format.'),
  validate,
];

/* ══════════════════════════════════════════
   SECTION VALIDATORS
══════════════════════════════════════════ */
exports.validateSection = [
  body('name')
    .notEmpty().withMessage('Section name is required.')
    .trim()
    .isLength({ min: 1, max: 100 }).withMessage('Name too long (100 max).'),
  body('language')
    .notEmpty().withMessage('Language is required.'),
  body('level')
    .notEmpty().withMessage('Level is required.'),
  body('capacity')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Invalid capacity (1–100).'),
  validate,
];

/* ══════════════════════════════════════════
   MESSAGE VALIDATORS
══════════════════════════════════════════ */
exports.validateMessage = [
  body('subject')
    .notEmpty().withMessage('Subject is required.')
    .isLength({ max: 200 }).withMessage('Subject too long (200 max).'),
  body('body')
    .notEmpty().withMessage('Message body is required.'),
  validate,
];

/* ══════════════════════════════════════════
   NOTE VALIDATORS
══════════════════════════════════════════ */
exports.validateNote = [
  body('note')
    .isFloat({ min: 0, max: 20 }).withMessage('Grade must be between 0 and 20.'),
  body('typeEvaluation')
    .isIn(['Devoir', 'Examen Partiel', 'Examen Final', 'Quiz', 'Oral'])
    .withMessage('Invalid evaluation type.'),
  validate,
];

/* ══════════════════════════════════════════
   PARENT VALIDATORS
══════════════════════════════════════════ */
exports.validateParent = [
  body('email')
    .isEmail().withMessage('Invalid email address.')
    .normalizeEmail(),
  body('nom').notEmpty().withMessage('Last name is required.').trim(),
  body('prenom').notEmpty().withMessage('First name is required.').trim(),
  validate,
];

/* ══════════════════════════════════════════
   PAGINATION VALIDATORS (query params)
══════════════════════════════════════════ */
exports.validatePagination = [
  query('page').optional().isInt({ min: 1 }).withMessage('Invalid page number.'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Invalid limit (1–100).'),
  validate,
];

/* ══════════════════════════════════════════
   MONGO ID PARAM VALIDATOR
══════════════════════════════════════════ */
exports.validateMongoId = (paramName = 'id') => [
  param(paramName).isMongoId().withMessage(`Invalid ${paramName}.`),
  validate,
];