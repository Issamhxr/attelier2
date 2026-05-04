const express = require('express');
const router  = express.Router();
const {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  getMoyenne,
  getNotesBySection,
  createNoteTeacher,
} = require('../controllers/noteController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

// ── Routes statiques EN PREMIER (avant /:id) ──────────────────
router.get('/moyenne/:etudiantId/:coursId', getMoyenne);

// Routes teacher (frontend GradesPage)
router.get(
  '/teacher/section/:sectionId',
  authorize('admin', 'professeur'),
  getNotesBySection
);
router.post(
  '/teacher',
  authorize('admin', 'professeur'),
  createNoteTeacher
);

// ── Routes CRUD standard ──────────────────────────────────────
router.get('/',       getNotes);
router.post('/',      authorize('admin', 'professeur'), createNote);
router.put('/:id',    authorize('admin', 'professeur'), updateNote);
router.delete('/:id', authorize('admin', 'professeur'), deleteNote);

module.exports = router;