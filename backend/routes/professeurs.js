const express = require('express');
const router = express.Router();
const { getProfesseurs, getProfesseur, updateProfesseur } = require('../controllers/professeurController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.get('/', authorize('admin'), getProfesseurs);
router.get('/:id', getProfesseur);
router.put('/:id', authorize('admin', 'professeur'), updateProfesseur);

module.exports = router;
