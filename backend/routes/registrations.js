// routes/registrations.js
const express = require('express');
const router  = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getPendingStudents,
  registerStudent,
  acceptStudent,
  rejectStudent,
} = require('../controllers/secretaireController');

router.use(protect);

router.get('/',              authorize('admin', 'secretaire'), getPendingStudents);
router.post('/',             authorize('admin', 'secretaire'), registerStudent);
router.put('/:id/accept',    authorize('admin', 'secretaire'), acceptStudent);
router.put('/:id/reject',    authorize('admin', 'secretaire'), rejectStudent);

module.exports = router;