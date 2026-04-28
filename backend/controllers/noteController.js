// controllers/noteController.js
const Note     = require('../models/Note');
const Etudiant = require('../models/Etudiant');

// GET /api/notes
exports.getNotes = async (req, res) => {
  try {
    const { etudiantId, coursId } = req.query;
    const filter = {};
    if (etudiantId) filter.etudiant = etudiantId;
    if (coursId)    filter.cours    = coursId;

    const notes = await Note.find(filter)
      .populate({ path: 'etudiant',   populate: { path: 'user', select: 'nom prenom' } })
      .populate('cours', 'nom langue')
      .populate({ path: 'professeur', populate: { path: 'user', select: 'nom prenom' } });

    return res.json({ success: true, count: notes.length, data: notes });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/notes
exports.createNote = async (req, res) => {
  try {
    const { note, noteMax } = req.body;

    // Validation montant
    if (note === undefined || note < 0 || note > (noteMax || 20)) {
      return res.status(400).json({ success: false, message: 'Note invalide (0 – 20).' });
    }

    const newNote = await Note.create(req.body);

    // Lier à l'étudiant
    const etudiant = await Etudiant.findById(req.body.etudiant);
    if (etudiant) {
      etudiant.notes.push(newNote._id);
      await etudiant.save();
    }

    return res.status(201).json({ success: true, data: newNote });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/notes/:id
exports.updateNote = async (req, res) => {
  try {
    const { note, noteMax } = req.body;
    if (note !== undefined && (note < 0 || note > (noteMax || 20))) {
      return res.status(400).json({ success: false, message: 'Note invalide.' });
    }

    const updated = await Note.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ success: false, message: 'Note non trouvée.' });

    return res.json({ success: true, data: updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/notes/:id
exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) return res.status(404).json({ success: false, message: 'Note non trouvée.' });

    // Retirer la référence dans l'étudiant
    await Etudiant.findByIdAndUpdate(note.etudiant, { $pull: { notes: note._id } });

    return res.json({ success: true, message: 'Note supprimée.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/notes/moyenne/:etudiantId/:coursId
exports.getMoyenne = async (req, res) => {
  try {
    const { etudiantId, coursId } = req.params;
    const notes = await Note.find({ etudiant: etudiantId, cours: coursId });
    if (!notes.length) {
      return res.json({ success: true, moyenne: null, message: 'Aucune note trouvée.' });
    }
    const moyenne = notes.reduce((sum, n) => sum + n.note, 0) / notes.length;
    return res.json({ success: true, moyenne: moyenne.toFixed(2), nbNotes: notes.length });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};