const User         = require('../models/User');
const Section      = require('../models/Section');
const Absence      = require('../models/Absence');
const Payment      = require('../models/Payment');
const Notification = require('../models/Notification');
const Message      = require('../models/Message');
const Settings     = require('../models/Settings');
const Timetable    = require('../models/Timetable');

function timeAgo(date) {
  const diff = Date.now() - new Date(date).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "À l'instant";
  if (m < 60) return `Il y a ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `Il y a ${h}h`;
  const d = Math.floor(h / 24);
  if (d === 1) return 'Hier';
  return new Date(date).toLocaleDateString('fr-DZ');
}

function formatMessageTime(date) {
  const d = new Date(date), now = new Date(), diff = now - d;
  if (diff < 86400000) return d.toLocaleTimeString('fr-DZ', { hour: '2-digit', minute: '2-digit' });
  if (diff < 172800000) return 'Hier';
  return d.toLocaleDateString('fr-DZ', { day: 'numeric', month: 'short' });
}

function initials(name) {
  return (name || '??').split(' ').map(n => n[0]).filter(Boolean).join('').slice(0, 2).toUpperCase();
}

// ── DASHBOARD ──────────────────────────────────────────
exports.getDashboardStats = async (req, res) => {
  try {
    const [totalStudents, pendingCount, sections, paymentsAgg, absencesCount] = await Promise.all([
      User.countDocuments({ role: 'etudiant', actif: true }),
      User.countDocuments({ role: 'etudiant', actif: false }),
      Section.find({ actif: true }).lean(),
      Payment.aggregate([{ $group: { _id: null, total: { $sum: '$amount' }, paid: { $sum: { $cond: [{ $eq: ['$status', 'paid'] }, '$amount', 0] } }, unpaidCount: { $sum: { $cond: [{ $ne: ['$status', 'paid'] }, 1, 0] } } } }]),
      Absence.countDocuments(),
    ]);
    const pay = paymentsAgg[0] || { total: 0, paid: 0, unpaidCount: 0 };
    return res.json({ success: true, stats: { totalStudents, pendingCount, totalSections: sections.length, totalRevenue: pay.total, paidRevenue: pay.paid, unpaidCount: pay.unpaidCount, absencesCount } });
  } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

// ── ÉTUDIANTS actifs ──────────────────────────────────
exports.getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'etudiant', actif: true })
      .select('_id nom prenom email telephone language level section absences createdAt')
      .sort({ createdAt: -1 }).lean();
    return res.json({
      success: true,
      students: students.map(s => ({
        id: s._id, name: `${s.prenom || ''} ${s.nom || ''}`.trim(),
        email: s.email, phone: s.telephone || '—',
        language: s.language || '—', level: s.level || '—',
        section: s.section || 'À assigner', absences: s.absences || 0,
        status: 'active', date: new Date(s.createdAt).toLocaleDateString('fr-DZ'),
      })),
    });
  } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

// ── ÉTUDIANTS en attente ──────────────────────────────
exports.getPendingStudents = async (req, res) => {
  try {
    const pending = await User.find({ role: 'etudiant', actif: false })
      .select('_id nom prenom email telephone language level createdAt')
      .sort({ createdAt: -1 }).lean();
    return res.json({
      success: true,
      pending: pending.map(s => ({
        id: s._id, name: `${s.prenom || ''} ${s.nom || ''}`.trim(),
        email: s.email, phone: s.telephone || '—',
        language: s.language || '—', level: s.level || '—',
        date: new Date(s.createdAt).toLocaleDateString('fr-DZ'),
      })),
    });
  } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

// ── INSCRIRE étudiant ─────────────────────────────────
exports.registerStudent = async (req, res) => {
  try {
    const { nom, prenom, email, telephone, language, level, section, password } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email obligatoire.' });
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ success: false, message: 'Email déjà utilisé.' });

    const user = await User.create({
      nom: nom || '', prenom: prenom || '', email: email.toLowerCase(),
      password: password || 'etudiant123', role: 'etudiant',
      telephone: telephone || '', language: language || '', level: level || '',
      section: section || 'À assigner', actif: false,
    });
    return res.status(201).json({ success: true, message: 'Inscription enregistrée en attente de validation.', student: { id: user._id, name: `${user.prenom} ${user.nom}`.trim(), email: user.email, phone: user.telephone, language: user.language, level: user.level, section: user.section } });
  } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

// ── ACCEPTER étudiant ─────────────────────────────────
exports.acceptStudent = async (req, res) => {
  try {
    const { section } = req.body;
    const updates = { actif: true };
    if (section) updates.section = section;
    const user = await User.findOneAndUpdate({ _id: req.params.id, role: 'etudiant' }, updates, { new: true });
    if (!user) return res.status(404).json({ success: false, message: 'Étudiant introuvable.' });
    if (section) {
      await Section.findOneAndUpdate({ name: section }, { $addToSet: { students: user._id }, $inc: { studentsCount: 1 } });
    }
    return res.json({ success: true, message: 'Étudiant accepté.', student: user });
  } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

// ── REJETER étudiant ──────────────────────────────────
exports.rejectStudent = async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ _id: req.params.id, role: 'etudiant', actif: false });
    if (!user) return res.status(404).json({ success: false, message: 'Étudiant introuvable ou déjà actif.' });
    return res.json({ success: true, message: 'Inscription rejetée.' });
  } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

// ── SECTIONS ──────────────────────────────────────────
exports.getSections = async (req, res) => {
  try {
    const sections = await Section.find().lean();
    const populated = await Promise.all(sections.map(async s => {
      let teacherName = s.teacherName || s.teacher || '—';
      if (s.teacherId) {
        try {
          const prof = await User.findById(s.teacherId).select('nom prenom').lean();
          if (prof) teacherName = `${prof.prenom || ''} ${prof.nom || ''}`.trim();
        } catch (_) {}
      }
      return { id: s._id, name: s.name, language: s.language || '—', level: s.level || 'A1', teacher: teacherName, teacherId: s.teacherId || null, students: s.studentsCount || 0, capacity: s.capacity || 12, time: s.time || '—', room: s.room || '—' };
    }));
    return res.json({ success: true, sections: populated });
  } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

exports.createSection = async (req, res) => {
  const ctrl = require('./sectionController');
  return ctrl.createSection(req, res);
};

exports.updateSection = async (req, res) => {
  const ctrl = require('./sectionController');
  return ctrl.updateSection(req, res);
};

exports.deleteSection = async (req, res) => {
  const ctrl = require('./sectionController');
  return ctrl.deleteSection(req, res);
};

// ── EMPLOI DU TEMPS ───────────────────────────────────
exports.getTimetable = async (req, res) => {
  try {
    const { day } = req.query;
    const filter = { actif: true };
    if (day !== undefined) filter.dayOfWeek = parseInt(day);
    const entries = await Timetable.find(filter).populate('sectionId', 'name language level').sort({ startTime: 1 }).lean();
    return res.json({ success: true, timetable: entries.map(e => ({ id: e._id, time: `${e.startTime}–${e.endTime}`, room: e.room, section: e.sectionId?.name || e.section, subject: e.sectionId?.language || e.subject, teacher: e.teacher, dayOfWeek: e.dayOfWeek })) });
  } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

exports.createTimetableEntry = async (req, res) => {
  try {
    const { sectionId, section, subject, teacher, room, startTime, endTime, dayOfWeek } = req.body;
    if (!room || startTime === undefined || endTime === undefined || dayOfWeek === undefined) {
      return res.status(400).json({ success: false, message: 'Salle, horaires et jour obligatoires.' });
    }
    const entry = await Timetable.create({ sectionId: sectionId || null, section: section || '', subject: subject || '', teacher: teacher || '', room, startTime, endTime, dayOfWeek: parseInt(dayOfWeek), actif: true });
    return res.status(201).json({ success: true, message: 'Créneau ajouté.', entry });
  } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

exports.deleteTimetableEntry = async (req, res) => {
  try {
    const entry = await Timetable.findByIdAndDelete(req.params.id);
    if (!entry) return res.status(404).json({ success: false, message: 'Créneau introuvable.' });
    return res.json({ success: true, message: 'Créneau supprimé.' });
  } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

// ── ABSENCES ──────────────────────────────────────────
exports.getAbsences = async (req, res) => {
  try {
    const { section, justified, studentId } = req.query;
    const filter = {};
    if (studentId) filter.student = studentId;
    if (justified !== undefined) filter.justified = justified === 'true';

    const absences = await Absence.find(filter).populate('student', 'nom prenom section').sort({ date: -1 }).lean();
    const formatted = absences.map(a => ({
      id: a._id, student: `${a.student?.prenom || ''} ${a.student?.nom || ''}`.trim() || '—',
      studentId: a.student?._id, section: a.student?.section || '',
      language: a.language, level: a.level, date: a.date, session: a.session, justified: a.justified,
    }));
    const result = section ? formatted.filter(a => a.section === section) : formatted;
    return res.json({ success: true, absences: result });
  } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

exports.createAbsence = async (req, res) => {
  const ctrl = require('./absenceController');
  return ctrl.createAbsence(req, res);
};

exports.toggleAbsenceJustified = async (req, res) => {
  const ctrl = require('./absenceController');
  return ctrl.toggleJustified(req, res);
};

exports.deleteAbsence = async (req, res) => {
  const ctrl = require('./absenceController');
  return ctrl.deleteAbsence(req, res);
};

// ── PAIEMENTS ─────────────────────────────────────────
exports.getPayments = async (req, res) => {
  try {
    const { status, month } = req.query;
    const filter = {};
    if (status && status !== 'all') filter.status = status;
    await Payment.updateMany({ status: 'pending', due: { $lt: new Date() }, paid: 0 }, { $set: { status: 'overdue' } });

    let payments = await Payment.find(filter).populate('student', 'nom prenom section').sort({ createdAt: -1 }).lean();
    if (month && month !== 'Tous') {
      payments = payments.filter(p => {
        const m = new Date(p.due).toLocaleDateString('fr-DZ', { month: 'long', year: 'numeric' });
        return m.toLowerCase() === month.toLowerCase();
      });
    }
    return res.json({
      success: true,
      payments: payments.map(p => ({
        id: p._id, name: `${p.student?.prenom || ''} ${p.student?.nom || ''}`.trim() || p.studentName || '—',
        amount: p.amount, date: new Date(p.createdAt).toLocaleDateString('fr-DZ'),
        method: p.method || 'Espèces', status: p.status,
        section: p.student?.section || p.section || '—',
        month: new Date(p.due).toLocaleDateString('fr-DZ', { month: 'long', year: 'numeric' }),
      })),
    });
  } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

exports.createPayment = async (req, res) => {
  try {
    const { studentId, studentName, amount, due, method, section } = req.body;
    if (!amount || !due) return res.status(400).json({ success: false, message: 'Montant et date obligatoires.' });
    let language = req.body.language || '', level = req.body.level || '';
    if (studentId) {
      const student = await User.findById(studentId).select('language level').lean();
      if (student) { language = language || student.language || ''; level = level || student.level || ''; }
    }
    const payment = await Payment.create({ student: studentId || null, studentName: studentName || '', language, level, amount: parseFloat(amount), paid: parseFloat(amount), due: new Date(due), method: method || 'Espèces', section: section || '', status: 'paid' });
    return res.status(201).json({ success: true, message: 'Paiement enregistré.', payment });
  } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

exports.markPaymentPaid = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ success: false, message: 'Paiement introuvable.' });
    payment.paid   = req.body.amount ? parseFloat(req.body.amount) : payment.amount;
    payment.status = 'paid';
    await payment.save();
    return res.json({ success: true, message: 'Paiement marqué comme payé.', payment });
  } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

exports.deletePayment = async (req, res) => {
  const ctrl = require('./paymentController');
  return ctrl.deletePayment(req, res);
};

// ── NOTIFICATIONS ─────────────────────────────────────
exports.getNotifications = async (req, res) => {
  try {
    const notifs = await Notification.find().sort({ createdAt: -1 }).limit(50).lean();
    return res.json({
      success: true,
      notifications: notifs.map(n => ({ id: n._id, type: n.type, icon: n.icon || '🔔', title: n.title, msg: n.msg || n.message || '', time: timeAgo(n.createdAt), tag: n.tag || n.type, read: n.read || false })),
    });
  } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

exports.markNotificationRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { read: true });
    return res.json({ success: true });
  } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

exports.markAllNotificationsRead = async (req, res) => {
  try {
    await Notification.updateMany({ read: false }, { read: true });
    return res.json({ success: true });
  } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

exports.deleteNotification = async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    return res.json({ success: true });
  } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

// ── MESSAGES ──────────────────────────────────────────
exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ recipient: req.user._id }).populate('sender', 'nom prenom role').sort({ createdAt: -1 }).lean();
    return res.json({
      success: true,
      messages: messages.map(m => ({
        id: m._id, from: `${m.sender?.prenom || ''} ${m.sender?.nom || ''}`.trim() || 'Inconnu',
        avatar: initials(`${m.sender?.prenom || ''} ${m.sender?.nom || ''}`),
        subject: m.subject, preview: (m.body || '').slice(0, 80) + '…',
        time: formatMessageTime(m.createdAt), read: m.read, starred: m.starred || false, tag: m.tag || 'sys', body: m.body,
      })),
    });
  } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

exports.sendMessage = async (req, res) => {
  try {
    const { recipientId, to, subject, body, tag } = req.body;
    const destId = recipientId || to;
    if (!destId || !subject || !body) return res.status(400).json({ success: false, message: 'Destinataire, sujet et corps obligatoires.' });
    const recipient = await User.findById(destId);
    if (!recipient) return res.status(404).json({ success: false, message: 'Destinataire introuvable.' });
    const message = await Message.create({ sender: req.user._id, recipient: destId, subject, body, tag: tag || 'sys', read: false });
    return res.status(201).json({ success: true, message: 'Message envoyé.', data: message });
  } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

exports.replyToMessage = async (req, res) => {
  try {
    const original = await Message.findById(req.params.id).populate('sender');
    if (!original) return res.status(404).json({ success: false, message: 'Message introuvable.' });
    const reply = await Message.create({ sender: req.user._id, recipient: original.sender._id, subject: `Re: ${original.subject}`, body: req.body.body, tag: original.tag || 'sys', read: false });
    return res.status(201).json({ success: true, message: 'Réponse envoyée.', data: reply });
  } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

exports.markMessageRead = async (req, res) => {
  try {
    await Message.findByIdAndUpdate(req.params.id, { read: true });
    return res.json({ success: true });
  } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

exports.toggleMessageStar = async (req, res) => {
  try {
    const msg = await Message.findById(req.params.id);
    if (!msg) return res.status(404).json({ success: false, message: 'Message introuvable.' });
    msg.starred = !msg.starred;
    await msg.save();
    return res.json({ success: true, starred: msg.starred });
  } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

exports.deleteMessage = async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: 'Message supprimé.' });
  } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

// ── SETTINGS ──────────────────────────────────────────
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password').lean();
    if (!user) return res.status(404).json({ success: false, message: 'Utilisateur introuvable.' });
    return res.json({ success: true, user });
  } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

exports.updateProfile = async (req, res) => {
  try {
    const { nom, prenom, email, telephone } = req.body;
    const updates = {};
    if (nom)       updates.nom       = nom;
    if (prenom)    updates.prenom    = prenom;
    if (email)     updates.email     = email.toLowerCase();
    if (telephone) updates.telephone = telephone;
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password');
    return res.json({ success: true, message: 'Profil mis à jour.', user });
  } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPwd, newPwd } = req.body;
    if (!currentPwd || !newPwd) return res.status(400).json({ success: false, message: 'Champs obligatoires manquants.' });
    if (newPwd.length < 6) return res.status(400).json({ success: false, message: 'Min 6 caractères.' });
    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.matchPassword(currentPwd);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Mot de passe actuel incorrect.' });
    user.password = newPwd;
    await user.save();
    return res.json({ success: true, message: 'Mot de passe mis à jour.' });
  } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

exports.getSchoolSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne().lean();
    if (!settings) settings = await Settings.create({ schoolName: 'Language School' });
    return res.json({ success: true, settings });
  } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

exports.updateSchoolSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) settings = new Settings();
    Object.assign(settings, req.body);
    await settings.save();
    return res.json({ success: true, message: 'Paramètres enregistrés.', settings });
  } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};