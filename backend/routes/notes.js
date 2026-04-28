// routes/notes.js
const express = require('express');
const router  = express.Router();
const {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  getMoyenne,
} = require('../controllers/noteController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

// ⚠️ Route statique avant /:id
router.get('/moyenne/:etudiantId/:coursId', getMoyenne);

router.get('/',    getNotes);
router.post('/',   authorize('admin', 'professeur'), createNote);
router.put('/:id', authorize('admin', 'professeur'), updateNote);
router.delete('/:id', authorize('admin', 'professeur'), deleteNote);

module.exports = router;