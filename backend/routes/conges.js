const express = require('express');
const router  = express.Router();
const Conge   = require('../models/Conge');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const conges = await Conge.find({
      date: { $gte: today, $lt: tomorrow }
    }).populate('professeur', 'nom prenom');

    res.json({ success: true, data: conges });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/', authorize('admin', 'secretaire'), async (req, res) => {
  try {
    const conge = await Conge.create(req.body);
    res.status(201).json({ success: true, data: conge });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.delete('/:id', authorize('admin'), async (req, res) => {
  try {
    await Conge.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;