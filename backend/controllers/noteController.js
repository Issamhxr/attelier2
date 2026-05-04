const Note     = require('../models/Note');
const Etudiant = require('../models/Etudiant');
const Professeur = require('../models/Professeur');

// Mapping frontend → enum DB
const TYPE_MAP = {
  Written:   'Devoir',
  Oral:      'Oral',
  Listening: 'Examen Partiel',
  Speaking:  'Oral',
  Mixed:     'Examen Final',
};

// Mapping DB → frontend
const TYPE_MAP_REVERSE = {
  'Devoir':          'Written',
  'Examen Partiel':  'Listening',
  'Examen Final':    'Mixed',
  'Quiz':            'Written',
  'Oral':            'Oral',
};

/* ══════════════════════════════════════════════
   GET /api/notes
══════════════════════════════════════════════ */
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

/* ══════════════════════════════════════════════
   POST /api/notes
══════════════════════════════════════════════ */
exports.createNote = async (req, res) => {
  try {
    const { note, noteMax } = req.body;

    if (note === undefined || note < 0 || note > (noteMax || 20)) {
      return res.status(400).json({ success: false, message: 'Note invalide (0 – 20).' });
    }

    const newNote = await Note.create(req.body);

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

/* ══════════════════════════════════════════════
   PUT /api/notes/:id
══════════════════════════════════════════════ */
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

/* ══════════════════════════════════════════════
   DELETE /api/notes/:id
══════════════════════════════════════════════ */
exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) return res.status(404).json({ success: false, message: 'Note non trouvée.' });

    await Etudiant.findByIdAndUpdate(note.etudiant, { $pull: { notes: note._id } });

    return res.json({ success: true, message: 'Note supprimée.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/* ══════════════════════════════════════════════
   GET /api/notes/moyenne/:etudiantId/:coursId
══════════════════════════════════════════════ */
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

/* ══════════════════════════════════════════════
   GET /api/notes/teacher/section/:sectionId
   Retourne les notes groupées par étudiant
   { grades: { studentId: { Written: 12, Oral: 15, … } } }
══════════════════════════════════════════════ */
exports.getNotesBySection = async (req, res) => {
  try {
    const { sectionId } = req.params;

    const notes = await Note.find({ cours: sectionId })
      .populate('etudiant', 'prenom nom email user');

    // Regroupe par étudiant._id → { typeEvaluation frontend: note }
    const grades = {};
    notes.forEach(n => {
      if (!n.etudiant) return;

      // On utilise l'userId si disponible, sinon l'_id Etudiant
      const eid = (n.etudiant.user || n.etudiant._id).toString();

      if (!grades[eid]) grades[eid] = {};
      const frontendType = TYPE_MAP_REVERSE[n.typeEvaluation] || 'Written';
      // Si plusieurs notes du même type → on garde la plus récente (dernière itérée)
      grades[eid][frontendType] = n.note;
    });

    return res.json({ success: true, grades });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/* ══════════════════════════════════════════════
   POST /api/notes/teacher
   Crée ou met à jour une note (upsert)
   Body: { etudiantId, coursId, typeEvaluation, note, noteMax, commentaire }
   typeEvaluation = clé frontend : Written | Oral | Listening | Speaking | Mixed
══════════════════════════════════════════════ */
exports.createNoteTeacher = async (req, res) => {
  try {
    const { etudiantId, coursId, typeEvaluation, note, noteMax, commentaire } = req.body;

    // Validation
    if (note === undefined || note < 0 || note > (noteMax || 20)) {
      return res.status(400).json({ success: false, message: 'Note invalide (0 – 20).' });
    }
    if (!etudiantId || !coursId || !typeEvaluation) {
      return res.status(400).json({ success: false, message: 'etudiantId, coursId et typeEvaluation sont requis.' });
    }

    // Convertit le type frontend → enum DB
    const dbType = TYPE_MAP[typeEvaluation];
    if (!dbType) {
      return res.status(400).json({ success: false, message: `typeEvaluation invalide : ${typeEvaluation}` });
    }

    // Résout le professeur depuis req.user (userId → Professeur._id)
    let professeurId = null;
    try {
      const prof = await Professeur.findOne({ user: req.user.id });
      if (prof) professeurId = prof._id;
    } catch (_) {}

    // Résout l'étudiant : etudiantId peut être un userId OU un Etudiant._id
    let etudiantDoc = await Etudiant.findById(etudiantId).catch(() => null);
    if (!etudiantDoc) {
      etudiantDoc = await Etudiant.findOne({ user: etudiantId }).catch(() => null);
    }
    if (!etudiantDoc) {
      return res.status(404).json({ success: false, message: 'Étudiant non trouvé.' });
    }

    // Upsert : une seule note par (etudiant, cours, typeEvaluation)
    const saved = await Note.findOneAndUpdate(
      {
        etudiant:       etudiantDoc._id,
        cours:          coursId,
        typeEvaluation: dbType,
      },
      {
        etudiant:       etudiantDoc._id,
        cours:          coursId,
        professeur:     professeurId,
        typeEvaluation: dbType,
        note,
        noteMax:        noteMax || 20,
        commentaire:    commentaire || '',
        dateEvaluation: new Date(),
      },
      { upsert: true, new: true, runValidators: true }
    );

    // S'assure que la note est liée à l'étudiant
    if (!etudiantDoc.notes.includes(saved._id)) {
      etudiantDoc.notes.push(saved._id);
      await etudiantDoc.save();
    }

    return res.status(201).json({ success: true, data: saved });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};