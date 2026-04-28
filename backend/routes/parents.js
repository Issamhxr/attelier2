// routes/parents.js
const express = require('express');
const router  = express.Router();
const {
  getParents,
  getParent,
  updateParent,
  addChild,        
  removeChild,     
  deleteParent,
} = require('../controllers/parentController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/',    authorize('admin', 'secretaire'), getParents);
router.get('/:id', getParent);
router.put('/:id', authorize('admin', 'secretaire'), updateParent);
router.post('/:id/link/:studentId',   authorize('admin', 'secretaire'), addChild);
router.delete('/:id/link/:studentId', authorize('admin', 'secretaire'), removeChild);
router.delete('/:id', authorize('admin'), deleteParent);

module.exports = router;