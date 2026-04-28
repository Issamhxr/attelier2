const express = require('express');
const router = express.Router();
const { getCours, getCour, createCours, updateCours, deleteCours, inscrireEtudiant } = require('../controllers/coursController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.get('/', getCours);
router.get('/:id', getCour);
router.post('/', authorize('admin'), createCours);
router.put('/:id', authorize('admin'), updateCours);
router.delete('/:id', authorize('admin'), deleteCours);
router.post('/:id/inscrire/:etudiantId', authorize('admin'), inscrireEtudiant);

module.exports = router;
