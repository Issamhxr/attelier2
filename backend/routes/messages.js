const express = require('express');
const router  = express.Router();
const Exam    = require('../models/Exam');
const auth    = require('../middleware/auth');

// GET tous les exams
router.get('/', auth, async (req, res) => {
  try {
    const exams = await Exam.find().sort({ date: 1 });
    res.json({ success: true, exams });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST créer un exam
router.post('/', auth, async (req, res) => {
  try {
    const { subject, date, room, type, section } = req.body;
    const exam = await Exam.create({ subject, date, room, type, section });
    res.json({ success: true, exam });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE supprimer un exam
router.delete('/:id', auth, async (req, res) => {
  try {
    await Exam.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;