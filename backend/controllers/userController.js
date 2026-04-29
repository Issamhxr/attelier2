const User   = require('../models/User');
const Parent = require('../models/Parent');

exports.validateStep = async (req, res) => {
  const { step, email } = req.body;
  if (step === 2 && email) {
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ success: false, field: 'email', message: 'Cet email est déjà utilisé.' });
  }
  return res.json({ success: true, message: `Étape ${step} valide` });
};

exports.createUser = async (req, res) => {
  try {
    const { role, fname, lname, email, phone, language, level, schedule, notes, specialty, hours, department, linkedStudent, relation } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email obligatoire.' });

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ success: false, message: 'Email déjà utilisé.' });

    const tempPassword = Math.random().toString(36).slice(-8);
    const userData = {
      nom: lname || '', prenom: fname || '', email: email.toLowerCase(),
      password: tempPassword, role: role || 'etudiant', telephone: phone || '', actif: true,
    };

    if (role === 'etudiant') { userData.language = language || ''; userData.level = level || ''; userData.schedule = schedule || ''; userData.notes = notes || ''; }
    else if (role === 'professeur') { userData.specialty = specialty || ''; userData.hours = hours || 0; }
    else if (role === 'secretaire') { userData.department = department || ''; }
    else if (role === 'parent') { userData.relation = relation || ''; userData.linkedStudent = linkedStudent || null; }

    const user = await User.create(userData);

    if (role === 'parent') {
      await Parent.create({ user: user._id, children: linkedStudent ? [{ student: linkedStudent, relation: relation || 'Autre' }] : [] });
    }

    try {
      const { sendWelcomeEmail } = require('../services/emailService');
      await sendWelcomeEmail({ to: user.email, name: `${user.prenom} ${user.nom}`, role: user.role, tempPassword });
    } catch (_) {}

    return res.status(201).json({
      success: true, message: 'Compte créé avec succès.',
      user: { id: user._id, nom: user.nom, prenom: user.prenom, name: `${user.prenom} ${user.nom}`.trim(), role: user.role, email: user.email, status: user.actif ? 'active' : 'pending' },
    });
  } catch (err) {
    console.error('[createUser]', err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getStudents = async (req, res) => {
  try {
    const { search, language, level, section, actif } = req.query;
    let filter = { role: 'etudiant' };
    if (language) filter.language = language;
    if (level) filter.level = level;
    if (section) filter.section = section;
    if (actif !== undefined) filter.actif = actif === 'true';

    let students = await User.find(filter)
      .select('_id nom prenom email language level telephone actif section absences schedule notes createdAt')
      .sort({ createdAt: -1 }).lean();

    if (search) {
      const q = search.toLowerCase();
      students = students.filter(s => {
        const name = `${s.prenom || ''} ${s.nom || ''}`.toLowerCase();
        return name.includes(q) || (s.email || '').toLowerCase().includes(q);
      });
    }

    return res.json({ success: true, students: students.map(s => ({ ...s, id: s._id, name: `${s.prenom || ''} ${s.nom || ''}`.trim() })) });
  } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

exports.archiveUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { actif: false, archivedAt: new Date() }, { new: true });
    if (!user) return res.status(404).json({ success: false, message: 'Utilisateur introuvable.' });
    return res.json({ success: true, message: 'Utilisateur archivé.', user });
  } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

exports.restoreUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { actif: true, $unset: { archivedAt: '' } }, { new: true });
    if (!user) return res.status(404).json({ success: false, message: 'Utilisateur introuvable.' });
    return res.json({ success: true, message: 'Utilisateur restauré.', user });
  } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

exports.updateUser = async (req, res) => {
  try {
    const { fname, lname, email, phone, language, level, specialty, hours, department, section, actif } = req.body;
    const updates = {};
    if (fname !== undefined)  updates.prenom    = fname;
    if (lname !== undefined)  updates.nom       = lname;
    if (email)                updates.email     = email.toLowerCase();
    if (phone !== undefined)  updates.telephone = phone;
    if (language !== undefined) updates.language = language;
    if (level !== undefined)    updates.level    = level;
    if (specialty !== undefined) updates.specialty = specialty;
    if (hours !== undefined)    updates.hours    = hours;
    if (department !== undefined) updates.department = department;
    if (section !== undefined)  updates.section  = section;
    if (actif !== undefined)    updates.actif    = actif;

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!user) return res.status(404).json({ success: false, message: 'Utilisateur introuvable.' });
    return res.json({ success: true, message: 'Utilisateur mis à jour.', user });
  } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'Utilisateur introuvable.' });
    return res.json({ success: true, message: 'Utilisateur supprimé.' });
  } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

exports.getArchived = async (req, res) => {
  try {
    const users = await User.find({ actif: false }).select('_id nom prenom email role telephone archivedAt').lean();
    return res.json({ success: true, users });
  } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

exports.getGlobalStats = async (req, res) => {
  try {
    const Absence = require('../models/Absence');
    const Payment = require('../models/Payment');
    const [totalStudents, totalTeachers, totalAbsences, payments, pending] = await Promise.all([
      User.countDocuments({ role: 'etudiant', actif: true }),
      User.countDocuments({ role: 'professeur', actif: true }),
      Absence.countDocuments(),
      Payment.find().select('amount paid'),
      User.countDocuments({ role: 'etudiant', actif: false }),
    ]);
    const totalRevenue     = payments.reduce((a, p) => a + p.amount, 0);
    const collectedRevenue = payments.reduce((a, p) => a + p.paid, 0);
    return res.json({ success: true, stats: { totalStudents, totalTeachers, totalAbsences, totalRevenue, collectedRevenue, pending } });
  } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'Utilisateur introuvable.' });
    return res.json({ success: true, user });
  } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

exports.updateMe = async (req, res) => {
  try {
    const { fname, lname, email, phone } = req.body;
    const updates = {};
    if (fname) updates.prenom = fname;
    if (lname) updates.nom    = lname;
    if (email) updates.email  = email.toLowerCase();
    if (phone) updates.telephone = phone;
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
    return res.json({ success: true, message: 'Profil mis à jour.', user });
  } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPwd, newPwd } = req.body;
    if (!currentPwd || !newPwd) return res.status(400).json({ success: false, message: 'Champs obligatoires manquants.' });
    if (newPwd.length < 6) return res.status(400).json({ success: false, message: 'Le mot de passe doit contenir au moins 6 caractères.' });
    const user = await User.findById(req.user.id).select('+password');
    const isMatch = await user.matchPassword(currentPwd);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Mot de passe actuel incorrect.' });
    user.password = newPwd;
    await user.save();
    return res.json({ success: true, message: 'Mot de passe mis à jour.' });
  } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};