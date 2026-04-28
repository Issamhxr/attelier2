// controllers/teacherController.js
const User       = require('../models/User');
const Professeur = require('../models/Professeur');

// GET /api/teacher/dashboard
exports.getDashboard = async (req, res) => {
  try {
    const prof = await User.findById(req.user.id).select('-password');
    const totalStudents = await User.countDocuments({ role: 'etudiant', actif: true });

    res.json({
      success: true,
      dashboard: {
        teacher: prof,
        totalStudents,
        message: 'Dashboard chargé avec succès',
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/teacher/profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'Profil introuvable.' });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/teacher/profile
exports.updateProfile = async (req, res) => {
  try {
    const { fname, lname, email, phone, specialty, bio } = req.body;
    const updates = {};
    if (fname)     updates.prenom    = fname;
    if (lname)     updates.nom       = lname;
    if (email)     updates.email     = email.toLowerCase();
    if (phone)     updates.telephone = phone;
    if (specialty) updates.specialty = specialty;

    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
    res.json({ success: true, message: 'Profil mis à jour.', user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/teacher/timetable
exports.getTimetable = async (req, res) => {
  try {
    // À connecter à ton modèle Emploi si tu en as un
    res.json({ success: true, timetable: [] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/teacher/students
exports.getMyStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'etudiant', actif: true })
      .select('nom prenom email language level telephone absences section actif')
      .lean();
    res.json({ success: true, students });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/teacher/courses
exports.getMyCourses = async (req, res) => {
  try {
    const teacher = await User.findById(req.user.id).select('classes specialty');
    res.json({ success: true, courses: teacher.classes || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/teacher/attendance
exports.getAttendanceSummary = async (req, res) => {
  try {
    const present = await User.countDocuments({ role: 'etudiant', actif: true, absences: 0 });
    const absent  = await User.countDocuments({ role: 'etudiant', actif: true, absences: { $gt: 0 } });
    res.json({ success: true, attendance: { present, absent } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};