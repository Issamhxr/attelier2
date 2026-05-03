const express      = require('express');
const router       = express.Router();
const Announcement = require('../models/Announcement');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/', async (req, res) => {
  try {
    const { section } = req.query;
    const filter = section
      ? { $or: [{ section }, { section: '' }] }
      : {};
    const announcements = await Announcement.find(filter).sort({ createdAt: -1 }).limit(10);
    res.json({ success: true, data: announcements });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/', authorize('admin', 'secretaire'), async (req, res) => {
  try {
    const ann = await Announcement.create(req.body);
    res.status(201).json({ success: true, data: ann });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.delete('/:id', authorize('admin'), async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;