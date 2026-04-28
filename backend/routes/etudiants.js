const express = require('express');
const router = express.Router();
const { getEtudiants, getEtudiant, updateEtudiant, deleteEtudiant } = require('../controllers/etudiantController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.get('/', authorize('admin', 'professeur'), getEtudiants);
router.get('/:id', getEtudiant);
router.put('/:id', updateEtudiant);
router.delete('/:id', authorize('admin'), deleteEtudiant);

module.exports = router;
