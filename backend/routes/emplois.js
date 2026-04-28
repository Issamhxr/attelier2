const express = require('express');
const router = express.Router();
const { getEmplois, createEmploi, updateEmploi, deleteEmploi } = require('../controllers/emploiController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.get('/', getEmplois);
router.post('/', authorize('admin'), createEmploi);
router.put('/:id', authorize('admin'), updateEmploi);
router.delete('/:id', authorize('admin'), deleteEmploi);

module.exports = router;
