// routes/parents.js
const express   = require('express');
const router    = express.Router();
const User      = require('../models/User');
const Etudiant  = require('../models/Etudiant');
const Absence   = require('../models/Absence');
const Note      = require('../models/Note');
const Timetable = require('../models/Timetable');
const Section   = require('../models/Section');
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

// ⚠️ Route statique AVANT /:id
router.get('/child', async (req, res) => {
  try {
    const parent = await User.findById(req.user.id);
    if (!parent.linkedStudent) {
      return res.status(404).json({ success: false, message: 'Aucun enfant lié.' });
    }

    const child = await User.findById(parent.linkedStudent);
    if (!child) return res.status(404).json({ success: false, message: 'Enfant introuvable.' });

    let etudiant = await Etudiant.findOne({ user: child._id });
    if (!etudiant) {
      const count = await Etudiant.countDocuments();
      etudiant = await Etudiant.create({
        user: child._id,
        matricule: `ETU-${String(count + 1).padStart(4, '0')}`,
        coursInscrits: [], notes: [], paiements: [],
      });
    }

    const absences = await Absence.find({ student: child._id }).sort({ date: -1 });

    const notes = await Note.find({ etudiant: etudiant._id })
      .populate('cours', 'nom langue')
      .sort({ dateEvaluation: -1 });

    let emplois = [];
    if (child.section && child.section !== 'À assigner') {
      const section = await Section.findOne({ name: child.section });
      if (section) {
        emplois = await Timetable.find({ sectionId: section._id, actif: true })
          .sort({ dayOfWeek: 1, startTime: 1 });
      }
    }

    return res.json({ success: true, child, etudiant, absences, notes, emplois });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Routes avec paramètre /:id — en dernier
router.get('/',    authorize('admin', 'secretaire'), getParents);
router.get('/:id', getParent);
router.put('/:id', authorize('admin', 'secretaire'), updateParent);
router.post('/:id/link/:studentId',   authorize('admin', 'secretaire'), addChild);
router.delete('/:id/link/:studentId', authorize('admin', 'secretaire'), removeChild);
router.delete('/:id', authorize('admin'), deleteParent);

module.exports = router;