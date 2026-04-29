const Absence = require('../models/Absence');
const User    = require('../models/User');

exports.getAbsences = async (req, res) => {
  try {
    const { language, session, reason, justified, search } = req.query;
    const filter = {};
    if (language && language !== 'All') filter.language = language;
    if (session  && session  !== 'All') filter.session  = session;
    if (reason   && reason   !== 'All') filter.reason   = reason;
    if (justified === 'Yes') filter.justified = true;
    if (justified === 'No')  filter.justified = false;

    let absences = await Absence.find(filter)
      .populate('student', 'nom prenom email language level section')
      .sort({ date: -1 });

    if (search) {
      const q = search.toLowerCase();
      absences = absences.filter(a => {
        const name = `${a.student?.prenom || ''} ${a.student?.nom || ''}`.toLowerCase();
        return name.includes(q) || (a.language || '').toLowerCase().includes(q);
      });
    }

    const formatted = absences.map(a => ({
      id: a._id, name: `${a.student?.prenom || ''} ${a.student?.nom || ''}`.trim(),
      language: a.language, level: a.level, date: a.date, session: a.session,
      reason: a.reason, justified: a.justified, studentId: a.student?._id,
      section: a.student?.section || '',
    }));

    return res.json({ success: true, absences: formatted });
  } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

exports.createAbsence = async (req, res) => {
  try {
    const { studentId, language, level, date, session, reason, justified } = req.body;
    if (!studentId || !date) return res.status(400).json({ success: false, message: 'studentId et date sont obligatoires.' });

    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(studentId)) return res.status(400).json({ success: false, message: 'ID étudiant invalide.' });

    const student = await User.findById(studentId);
    if (!student) return res.status(404).json({ success: false, message: 'Étudiant introuvable.' });

    const absence = await Absence.create({
      student: studentId, language: language || student.language || '',
      level: level || student.level || '', date: new Date(date),
      session: session || 'Morning', reason: reason || 'Unknown', justified: justified || false,
    });

    await User.findByIdAndUpdate(studentId, { $inc: { absences: 1 } });

    return res.status(201).json({
      success: true, message: 'Absence enregistrée.',
      absence: {
        id: absence._id, name: `${student.prenom || ''} ${student.nom || ''}`.trim(),
        language: absence.language, level: absence.level, date: absence.date,
        session: absence.session, reason: absence.reason, justified: absence.justified,
        studentId: student._id, section: student.section || '',
      },
    });
  } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

exports.toggleJustified = async (req, res) => {
  try {
    const absence = await Absence.findById(req.params.id);
    if (!absence) return res.status(404).json({ success: false, message: 'Absence introuvable.' });
    absence.justified = !absence.justified;
    await absence.save();
    return res.json({ success: true, justified: absence.justified });
  } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

exports.deleteAbsence = async (req, res) => {
  try {
    const absence = await Absence.findByIdAndDelete(req.params.id);
    if (!absence) return res.status(404).json({ success: false, message: 'Absence introuvable.' });
    await User.findByIdAndUpdate(absence.student, { $inc: { absences: -1 } });
    await User.updateOne({ _id: absence.student, absences: { $lt: 0 } }, { $set: { absences: 0 } });
    return res.json({ success: true, message: 'Absence supprimée.' });
  } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

exports.getStats = async (req, res) => {
  try {
    const total     = await Absence.countDocuments();
    const justified = await Absence.countDocuments({ justified: true });
    const weekAgo   = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
    const thisWeek  = await Absence.countDocuments({ date: { $gte: weekAgo } });
    return res.json({ success: true, stats: { total, justified, unjustified: total - justified, thisWeek } });
  } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};