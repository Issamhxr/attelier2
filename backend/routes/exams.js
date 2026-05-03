const express = require('express');
const router  = express.Router();
const Exam    = require('../models/Exam');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/', async (req, res) => {
  try {
    const { section } = req.query;
    const filter = section ? { section } : {};
    const exams = await Exam.find(filter).sort({ date: 1 });
    res.json({ success: true, data: exams });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/', authorize('admin', 'professeur'), async (req, res) => {
  try {
    const exam = await Exam.create(req.body);
    res.status(201).json({ success: true, data: exam });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.delete('/:id', authorize('admin', 'professeur'), async (req, res) => {
  try {
    await Exam.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;