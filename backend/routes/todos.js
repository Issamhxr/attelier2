const express = require('express');
const router  = express.Router();
const Todo    = require('../models/Todo');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, data: todos });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const todo = await Todo.create({ ...req.body, user: req.user.id });
    res.status(201).json({ success: true, data: todo });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    res.json({ success: true, data: todo });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Todo.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;