// server.js
const express        = require('express');
const mongoose       = require('mongoose');
const cors           = require('cors');
const http           = require('http');
const Message = require('./models/Message');
const Todo      = require('./models/Todo');
const Exam      = require('./models/Exam');
const Note      = require('./models/Note');
const Timetable = require('./models/Timetable');
const { Server }     = require('socket.io');
const jwt            = require('jsonwebtoken');
const bcrypt         = require('bcryptjs');
const multer         = require('multer');
const path           = require('path');
const fs             = require('fs');
require('dotenv').config();

const app    = express();
const server = http.createServer(app);
// ✅ APRÈS
const ALLOWED_ORIGINS = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
  : ['http://localhost:5173', 'http://192.168.130.115:5173'];

const io = new Server(server, {
  cors: {
    origin: ALLOWED_ORIGINS,
    credentials: true,
  }
});
/* ══════════════════════════════════════════════════════
   MIDDLEWARE
══════════════════════════════════════════════════════ */
app.use(cors({
  origin: ALLOWED_ORIGINS,
  credentials: true
}));

app.use(express.json());
app.use((req, _res, next) => { req.io = io; next(); });

// Dossier uploads statique
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
app.use('/uploads', express.static(uploadDir));

/* ══════════════════════════════════════════════════════
   MULTER CONFIG
══════════════════════════════════════════════════════ */
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename:    (_req, file,  cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `avatar-${Date.now()}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    cb(null, allowed.includes(file.mimetype));
  },
});

/* ══════════════════════════════════════════════════════
   MONGOOSE MODELS
══════════════════════════════════════════════════════ */

// ── User ──
const userSchema = new mongoose.Schema({
  prenom:     String,
  nom:        String,
  email:      { type: String, unique: true },
  password:   String,
  role:       { type: String, enum: ['admin','etudiant','professeur','secretaire','parent'], default: 'etudiant' },
  telephone:  String,
  dateNaissance: Date,
  actif:      { type: Boolean, default: true },
  avatar:     String,           // ✅ NOUVEAU
  // Etudiant
  language:   String,
  level:      String,
  schedule:   String,
  notes:      String,
  absences:   { type: Number, default: 0 },
  sections:   [{ type: mongoose.Schema.Types.ObjectId, ref: 'Section' }],
  // Professeur
  specialty:  String,
  hours:      Number,
  rating:     { type: Number, default: 5.0 },
  classes:    [String],
  joined:     String,
  // Secrétaire
  department:   String,
  permissions:  [String],
  // Parent
  linkedStudent: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// ── Section ──
const sectionSchema = new mongoose.Schema({
  name:       String,
  language:   String,
  level:      String,
  teacher:    String,
  teacherId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  time:       String,
  room:       String,
  capacity:   { type: Number, default: 12 },
  studentIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

sectionSchema.virtual('students').get(function () {
  return this.studentIds?.length || 0;
});
sectionSchema.set('toJSON', { virtuals: true });
const Section = mongoose.model('Section', sectionSchema);

// ── Absence ──
const absenceSchema = new mongoose.Schema({
studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name:      String,
  language:  String,
  level:     String,
  date:      { type: Date, default: Date.now },
  session:   { type: String, enum: ['Morning','Evening','Weekend'], default: 'Morning' },
  reason:    { type: String, enum: ['Sick','Personal','Travel','Unknown'], default: 'Unknown' },
  justified: { type: Boolean, default: false },
}, { timestamps: true });
const Absence = mongoose.model('Absence', absenceSchema);

// ── Payment ──
const paymentSchema = new mongoose.Schema({
  studentId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  student:     String,
  language:    String,
  level:       String,
  amount:      Number,
  paid:        { type: Number, default: 0 },
  due:         Date,
  status:      { type: String, enum: ['paid','partial','pending','overdue'], default: 'pending' },
  method:      { type: String, default: '—' },
}, { timestamps: true });
const Payment = mongoose.model('Payment', paymentSchema);

// ── Notification ──
const notifSchema = new mongoose.Schema({
  userId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type:    { type: String, enum: ['payment','absence','system','alert'], default: 'system' },
  icon:    { type: String, default: '🔔' },
  title:   String,
  msg:     String,
  tag:     String,
  read:    { type: Boolean, default: false },
  targets: [String],
  time:    { type: String, default: '' },
}, { timestamps: true });
const Notification = mongoose.model('Notification', notifSchema);

// ── Settings ──
const settingsSchema = new mongoose.Schema({
  schoolName:  { type: String, default: 'Language School' },
  city:        String,
  address:     String,
  email:       String,
  phone:       String,
  maxStudents: Number,
}, { timestamps: true });
const Settings = mongoose.model('Settings', settingsSchema);
/* ══════════════════════════════════════════════════════
   ROUTES — TODOS
══════════════════════════════════════════════════════ */
app.get('/api/todos', auth, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, todos });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.post('/api/todos', auth, async (req, res) => {
  try {
    const todo = await Todo.create({ ...req.body, user: req.user.id });
    res.json({ success: true, todo });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.patch('/api/todos/:id', auth, async (req, res) => {
  try {
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    res.json({ success: true, todo });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.delete('/api/todos/:id', auth, async (req, res) => {
  try {
    await Todo.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

/* ══════════════════════════════════════════════════════
   ROUTES — EXAMS
══════════════════════════════════════════════════════ */
app.get('/api/exams', auth, async (req, res) => {
  try {
    const exams = await Exam.find().sort({ date: 1 });
    res.json({ success: true, exams });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.post('/api/exams', auth, async (req, res) => {
  try {
    const exam = await Exam.create(req.body);
    req.io.emit('exam:added', exam);
    res.json({ success: true, exam });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.delete('/api/exams/:id', auth, async (req, res) => {
  try {
    await Exam.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

/* ══════════════════════════════════════════════════════
   ROUTES — NOTES
══════════════════════════════════════════════════════ */
app.get('/api/notes', auth, async (req, res) => {
  try {
    // Étudiant : ses propres notes via le modèle Etudiant
    // On cherche l'Etudiant lié à ce User
    const Etudiant = require('./models/Etudiant');
    const etudiant = await Etudiant.findOne({ user: req.user.id });
    if (!etudiant) return res.json({ success: true, notes: [] });

    const notes = await Note.find({ etudiant: etudiant._id })
      .populate('cours', 'nom langue')
      .sort({ dateEvaluation: -1 });
    res.json({ success: true, notes });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});
app.get('/api/notes/teacher/section/:sectionId', auth, async (req, res) => {
  try {
    const section = await Section.findById(req.params.sectionId);
    if (!section) return res.status(404).json({ success: false });

    const Etudiant = require('./models/Etudiant');
    const etudiants = await Etudiant.find({ user: { $in: section.studentIds } });

    const notes = await Note.find({ etudiant: { $in: etudiants.map(e => e._id) } })
      .populate({ path: 'etudiant', populate: { path: 'user', select: '_id' } });

    // Retourne un objet { userId: { Written: 15, Oral: 12, ... } }
    const grades = {};
    notes.forEach(n => {
      const uid = String(n.etudiant?.user?._id);
      if (!uid) return;
      if (!grades[uid]) grades[uid] = {};
      grades[uid][n.typeEvaluation] = n.note;
    });

    res.json({ success: true, grades });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.post('/api/notes', auth, async (req, res) => {
  try {
    const note = await Note.create(req.body);
    const Etudiant = require('./models/Etudiant');
    const etudiant = await Etudiant.findById(req.body.etudiant).populate('user');

    if (etudiant?.user) {
      const payload = {
        studentId: etudiant.user._id,
        subject:   note.typeEvaluation,
        note:      note.note,
        noteMax:   note.noteMax,
      };

      // ✅ Notifie l'étudiant
      req.io.to(`user:${etudiant.user._id}`).emit('note:added', payload);

      // ✅ Notifie le parent
      const parent = await User.findOne({ linkedStudent: etudiant.user._id });
      if (parent) {
        req.io.to(`user:${parent._id}`).emit('note:added', payload);
      }

      // ✅ Notifie tout le monde (admin, secrétaire)
      req.io.emit('note:added', payload);
    }

    res.json({ success: true, note });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ══════════════════════════════════════════════════════
   ROUTES — EMPLOIS DU TEMPS
══════════════════════════════════════════════════════ */
app.get('/api/emplois', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    let query = { actif: true };

    if (user.role === 'professeur') {
      const sections = await Section.find({ teacherId: req.user.id });
      const sectionIds = sections.map(s => s._id);
      query.sectionId = { $in: sectionIds };

    } else if (user.role === 'etudiant') {
      // ✅ user.sections est un tableau d'ObjectId
      if (user.sections?.length > 0) {
        query.sectionId = { $in: user.sections };
      } else {
        // ✅ fallback : cherche via studentIds dans Section
        const sections = await Section.find({ studentIds: user._id });
        if (sections.length > 0) {
          query.sectionId = { $in: sections.map(s => s._id) };
          // ✅ Met à jour user.sections pour les prochains appels
          await User.findByIdAndUpdate(user._id, {
            sections: sections.map(s => s._id),
            language: sections[0].language,
            level:    sections[0].level,
          });
        } else {
          // aucune section → retourne vide
          return res.json({ success: true, data: [] });
        }
      }
    }

    const emplois = await Timetable.find(query).sort({ dayOfWeek: 1, startTime: 1 });
    res.json({ success: true, data: emplois });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
app.post('/api/emplois', auth, async (req, res) => {
  try {
    const emploi = await Timetable.create(req.body);
    req.io.emit('timetable:updated', emploi);
    res.json({ success: true, emploi });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.delete('/api/emplois/:id', auth, async (req, res) => {
  try {
    await Timetable.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

/* ══════════════════════════════════════════════════════
   ROUTES — SECTIONS/TEACHER
══════════════════════════════════════════════════════ */
app.get('/api/sections/teacher', auth, async (req, res) => {
  try {
    const sections = await Section.find({ teacherId: req.user.id });
    res.json({ success: true, sections });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

/* ══════════════════════════════════════════════════════
   ROUTES — PARENTS/CHILD
══════════════════════════════════════════════════════ */
app.get('/api/parents/child', auth, async (req, res) => {
  try {
    const parent = await User.findById(req.user.id);
    if (!parent?.linkedStudent)
      return res.status(404).json({ success: false, message: 'Aucun enfant lié.' });

    const child = await User.findById(parent.linkedStudent).select('-password');
    if (!child)
      return res.status(404).json({ success: false, message: 'Enfant introuvable.' });

    const absences = await Absence.find({ studentId: child._id }).sort({ date: -1 });

    const Etudiant = require('./models/Etudiant');
    const etudiant = await Etudiant.findOne({ user: child._id });
    const notes = etudiant
      ? await Note.find({ etudiant: etudiant._id })
          .populate('cours', 'nom langue')
          .sort({ dateEvaluation: -1 })
      : [];

    let emplois = [];
    if (child.section) {
      const section = await Section.findOne({ name: child.section });
      if (section) emplois = await Timetable.find({ sectionId: section._id, actif: true });
    }

    res.json({ success: true, child, absences, notes, emplois });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

/* ══════════════════════════════════════════════════════
   ROUTE — ABSENCES (mise à jour pour notifier étudiant + parent)
   Remplace l'ancienne route POST /api/absences
══════════════════════════════════════════════════════ */
// ⚠️ Supprime l'ancienne et remplace par celle-ci :


app.post('/api/absences', auth, async (req, res) => {
  try {
    const { studentId, name, language, level, date, session, reason } = req.body;
    const absence = await Absence.create({ studentId, name, language, level, date, session, reason });
    const updated = await User.findByIdAndUpdate(studentId, { $inc: { absences: 1 } }, { new: true });
req.io.emit('absence:marked', { studentId, absent: true, totalAbsences: updated?.absences || 0 });
    req.io.to(`user:${studentId}`).emit('absence:marked', { studentId, date, language, session });
    const parentUser = await User.findOne({ linkedStudent: studentId });
    if (parentUser) {
      req.io.to(`user:${parentUser._id}`).emit('absence:marked', { studentId, date, language, session });
    }
    res.json({ success: true, absence });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
/* ══════════════════════════════════════════════════════
   AUTH MIDDLEWARE
══════════════════════════════════════════════════════ */
function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ success: false, message: 'No token' });
  const token = header.split(' ')[1];
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
}

/* ══════════════════════════════════════════════════════
   HELPER
══════════════════════════════════════════════════════ */
function formatNotif(n) {
  const elapsed = Date.now() - new Date(n.createdAt).getTime();
  const mins  = Math.floor(elapsed / 60000);
  const hours = Math.floor(elapsed / 3600000);
  const days  = Math.floor(elapsed / 86400000);
  let time;
  if (mins < 1)        time = 'Just now';
  else if (mins < 60)  time = `${mins} min ago`;
  else if (hours < 24) time = `${hours}h ago`;
  else                 time = `${days}d ago`;
  return {
    id: String(n._id), type: n.type, icon: n.icon,
    title: n.title, msg: n.msg, tag: n.tag || n.type,
    read: n.read, time,
  };
}

/* ══════════════════════════════════════════════════════
   ROUTES — AUTH
══════════════════════════════════════════════════════ */
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      role:   user.role,
      userId: user._id,      // ✅ AJOUT
      prenom: user.prenom,   // ✅ AJOUT
      nom:    user.nom,      // ✅ AJOUT
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ══════════════════════════════════════════════════════
   ROUTES — USERS
══════════════════════════════════════════════════════ */
app.get('/api/users/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('sections', 'name language level time room'); // ✅ peuple les sections

    if (!user) return res.status(404).json({ success: false });

    // ✅ Ajoute section (nom de la première section) pour compatibilité frontend
    const userObj = user.toJSON();
    if (user.sections?.length > 0) {
      userObj.section  = user.sections[0].name;
      userObj.language = userObj.language || user.sections[0].language;
      userObj.level    = userObj.level    || user.sections[0].level;
    }

    res.json({ success: true, user: userObj });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
app.put('/api/users/me', auth, async (req, res) => {
  try {
    const { fname, lname, email, phone } = req.body;
    await User.findByIdAndUpdate(req.user.id, {
      prenom: fname,
      nom: lname,
      email: email,
      telephone: phone,
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
app.put('/api/users/:id', auth, async (req, res) => {
  try {
    const { level } = req.body;
    await User.findByIdAndUpdate(req.params.id, { level });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});
app.patch('/api/users/change-password', auth, async (req, res) => {
  try {
    const { currentPwd, newPwd } = req.body;
    const user = await User.findById(req.user.id);
    if (!(await bcrypt.compare(currentPwd, user.password)))
      return res.status(400).json({ success: false, message: 'Wrong password' });
    user.password = await bcrypt.hash(newPwd, 10);
    await user.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ UPLOAD AVATAR
app.post('/api/users/upload-avatar', auth, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

    const avatarUrl = `/uploads/${req.file.filename}`;

    // Supprimer l'ancienne photo
    const user = await User.findById(req.user.id);
    if (user?.avatar && user.avatar.startsWith('/uploads/')) {
      const oldPath = path.join(__dirname, user.avatar);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    await User.findByIdAndUpdate(req.user.id, { avatar: avatarUrl });
    res.json({ success: true, avatarUrl });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ REMOVE AVATAR
app.delete('/api/users/remove-avatar', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user?.avatar && user.avatar.startsWith('/uploads/')) {
      const oldPath = path.join(__dirname, user.avatar);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }
    await User.findByIdAndUpdate(req.user.id, { avatar: null });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/users/validate-step', auth, async (req, res) => {
  try {
    const { step, email } = req.body;
    if (step === 2 && email) {
      const exists = await User.findOne({ email });
      if (exists) return res.json({ success: false, message: 'Email already used' });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/users/students', auth, async (req, res) => {
  try {
    const students = await User.find({ role: 'etudiant', actif: { $ne: false } }).select('-password');
    res.json({ success: true, students });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/users/teachers', auth, async (req, res) => {
  try {
    const teachers = await User.find({ role: 'professeur', actif: { $ne: false } }).select('-password');
    const enriched = await Promise.all(teachers.map(async (t) => {
      const sections = await Section.find({ teacherId: t._id });
      const studentCount = sections.reduce((a, s) => a + (s.studentIds?.length || 0), 0);
      return { ...t.toJSON(), students: studentCount, classes: sections.map(s => `${s.name} (${s.level})`) };
    }));
    res.json({ success: true, teachers: enriched });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/users/archived', auth, async (req, res) => {
  try {
    const { role } = req.query;
    const query = { actif: false };
    if (role) query.role = role;
    const users = await User.find(query).select('-password');
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
app.get('/api/users/role/:role', auth, async (req, res) => {
  try {
    const users = await User.find({ role: req.params.role, actif: { $ne: false } }).select('-password');
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/users', auth, async (req, res) => {
  try {
    const { role, fname, lname, email, phone, dob, language, level, schedule, notes,
            specialty, hours, department, permissions, linkedStudent } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ success: false, message: 'Email already used' });
    const tempPassword = await bcrypt.hash('Changeme123!', 10);
    const user = await User.create({
      role, prenom: fname, nom: lname, email,
      password: tempPassword, telephone: phone,
      dateNaissance: dob || undefined,
      language, level, schedule, notes,
      specialty, hours: hours ? Number(hours) : undefined,
      department, permissions: permissions || [],
      linkedStudent: linkedStudent || undefined,
      joined: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    });
    if (role === 'etudiant') req.io.emit('student:added', user);
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ══════════════════════════════════════════════════════
   ROUTES — SECTIONS
══════════════════════════════════════════════════════ */

app.get('/api/sections', auth, async (req, res) => {
  try {
    const sections = await Section.find();
    res.json({ success: true, sections });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
app.post('/api/sections', auth, async (req, res) => {
  try {
    const { name, language, level, teacher, teacherId, time, room, capacity } = req.body;
    const section = await Section.create({
      name, language, level, teacher,
      teacherId: teacherId || undefined,
      time, room, capacity: capacity || 12, studentIds: [],
    });
    // ✅ Notifie le professeur concerné
    if (teacherId) {
      req.io.to(`user:${teacherId}`).emit('section:assigned', {
        id: String(section._id),
        name: section.name,
        language: section.language,
        level: section.level,
        time: section.time,
        room: section.room,
      });
    }
    res.json({ success: true, section });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/sections/:id', auth, async (req, res) => {
  try {
    await Section.findByIdAndDelete(req.params.id);
    req.io.emit('section:deleted', { id: req.params.id });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/sections/:id/enroll', auth, async (req, res) => {
  try {
    const { studentId } = req.body;
    const section = await Section.findById(req.params.id);
    if (!section) return res.status(404).json({ success: false, message: 'Section not found' });
    if (section.studentIds.length >= section.capacity)
      return res.status(400).json({ success: false, message: 'Section is full' });
    
    // Vérifier si déjà inscrit — évite le double ajout
    if (section.studentIds.map(String).includes(String(studentId)))
      return res.status(400).json({ success: false, message: 'Already enrolled' });

    // Utiliser $addToSet au lieu de push pour éviter les doublons
    await Section.findByIdAndUpdate(req.params.id, {
      $addToSet: { studentIds: studentId }
    });

    await User.findByIdAndUpdate(studentId, {
      $addToSet: { sections: section._id },
      language: section.language,
      level: section.level,
    });

    // Recharger pour avoir le vrai count
    const updated = await Section.findById(req.params.id);
req.io.emit('section:updated', { 
  id: String(updated._id), 
  students: updated.studentIds.length,
  name: updated.name,
  language: updated.language,
  level: updated.level,
  time: updated.time,
  room: updated.room,
});

// ✅ Notifie l'étudiant que sa section a changé
req.io.to(`user:${studentId}`).emit('section:assigned', {
  id: String(updated._id),
  name: updated.name,
  language: updated.language,
  level: updated.level,
  time: updated.time,
  room: updated.room,
});

// ✅ Notifie le parent de l'étudiant
const parentUser = await User.findOne({ linkedStudent: studentId });
if (parentUser) {
  req.io.to(`user:${parentUser._id}`).emit('section:assigned', {
    id: String(updated._id),
    name: updated.name,
    language: updated.language,
  });
}
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/sections/:id/students', auth, async (req, res) => {
  try {
    const section = await Section.findById(req.params.id);
    if (!section) return res.status(404).json({ success: false, message: 'Section not found' });

    const students = await User.find({
      _id: { $in: section.studentIds },
    }).select('-password');

    res.json({ success: true, students });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ══════════════════════════════════════════════════════
   ROUTES — ABSENCES
══════════════════════════════════════════════════════ */
app.get('/api/absences', auth, async (req, res) => {
  try {
    // ✅ filtre par studentId si étudiant
    const query = req.user.role === 'etudiant'
      ? { studentId: req.user.id }
      : {};

    const absences = await Absence.find(query).sort({ date: -1 });
const formatted = absences.map(a => ({
  id:        String(a._id),
  studentId: String(a.studentId || ''),
  name:      a.name,
  language:  a.language,
  level:     a.level,
  date:      a.date,
  session:   a.session,
  reason:    a.reason,
  justified: a.justified,
}));
    res.json({ success: true, absences: formatted });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
app.get('/api/absences/stats', auth, async (req, res) => {
  try {
    const all         = await Absence.find();
    const total       = all.length;
    const justified   = all.filter(a => a.justified).length;
    const unjustified = total - justified;
    const weekAgo     = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const thisWeek    = all.filter(a => new Date(a.date) >= weekAgo).length;
    const studentCount = await User.countDocuments({ role: 'etudiant', actif: true });
    const absPerStudent = studentCount > 0 ? (total / studentCount) : 0;
    const avgRate = Math.max(0, Math.round(100 - absPerStudent * 5));
    const teachCount = await User.countDocuments({ role: 'professeur', actif: true }).catch(() => 4);
    const days = ['Mon','Tue','Wed','Thu','Fri'];
    const now  = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1);
    startOfWeek.setHours(0,0,0,0);
    const weekly = await Promise.all(days.map(async (day, i) => {
      const dayStart = new Date(startOfWeek);
      dayStart.setDate(startOfWeek.getDate() + i);
      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23,59,59,999);
      const dayAbsences = all.filter(a => {
        const d = new Date(a.date);
        return d >= dayStart && d <= dayEnd;
      }).length;
      const studRate   = Math.max(80, Math.round(100 - (dayAbsences / Math.max(studentCount, 1)) * 100));
      const teacherAbs = Math.floor(dayAbsences * 0.1);
      const teachRate  = Math.max(80, Math.round(100 - (teacherAbs / Math.max(teachCount, 1)) * 100));
      return { day, students: studRate, teachers: teachRate };
    }));
    const monthAgo = new Date();
    monthAgo.setDate(1);
    monthAgo.setHours(0,0,0,0);
    const newThisMonth = await User.countDocuments({ role: 'etudiant', createdAt: { $gte: monthAgo } });
    res.json({ success: true, stats: { total, justified, unjustified, thisWeek, avgRate, weekly, newThisMonth, trend: '+2.3% vs last week' } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.patch('/api/absences/:id/justify', auth, async (req, res) => {
  try {
    const absence = await Absence.findById(req.params.id);
    if (!absence) return res.status(404).json({ success: false });
    absence.justified = !absence.justified;
    await absence.save();
    res.json({ success: true, justified: absence.justified });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
app.delete('/api/absences/today/:studentId', auth, async (req, res) => {
  try {
    let studentObjId;
    try {
      studentObjId = new mongoose.Types.ObjectId(req.params.studentId);
    } catch {
      return res.status(400).json({ success: false, message: 'Invalid studentId' });
    }

    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const end   = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    // ✅ deleteMany au cas où plusieurs absences le même jour
    const result = await Absence.deleteMany({
      studentId: studentObjId,
      date: { $gte: start, $lte: end },
    });

    if (result.deletedCount > 0) {
      await User.findByIdAndUpdate(studentObjId, {
        $inc: { absences: -result.deletedCount }
      });
      req.io.emit('absence:marked', {
        studentId: req.params.studentId,
        absent: false,
        totalAbsences: 0,
      });
    }

    res.json({ success: true, deleted: result.deletedCount });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
app.delete('/api/absences/:id', auth, async (req, res) => {
  try {
    const absence = await Absence.findByIdAndDelete(req.params.id);
    if (!absence) return res.status(404).json({ success: false });
    await User.findByIdAndUpdate(absence.studentId, { $inc: { absences: -1 } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


/* ══════════════════════════════════════════════════════
   ROUTES — PAYMENTS
══════════════════════════════════════════════════════ */

app.get('/api/payments', auth, async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    const formatted = payments.map(p => ({
      id: String(p._id), student: p.student, lang: p.language,
      level: p.level, amount: p.amount, paid: p.paid,
      due: p.due, status: p.status, method: p.method, createdAt: p.createdAt,
    }));
    res.json({ success: true, payments: formatted });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
/* ══════════════════════════════════════════════════════
   ROUTES — PARENTS
══════════════════════════════════════════════════════ */
app.get('/api/parents/child', auth, async (req, res) => {
  try {
    const parent = await User.findById(req.user.id);
    if (!parent?.linkedStudent)
      return res.status(404).json({ success: false, message: 'Aucun enfant lié.' });

    const child = await User.findById(parent.linkedStudent).select('-password');
    if (!child)
      return res.status(404).json({ success: false, message: 'Enfant introuvable.' });

    const absences = await Absence.find({ studentId: child._id }).sort({ date: -1 });

    // Notes — requires a Note model; skip if you don't have one in server.js
    let notes = [];
    // const notes = await Note.find({ ... })

    // Emplois — requires Timetable model; skip if not in server.js
    let emplois = [];

    return res.json({ success: true, child, absences, notes, emplois });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/payments/stats', auth, async (req, res) => {
  try {
    const payments = await Payment.find();
    const monthMap = {};
    payments.forEach(p => {
      const d   = new Date(p.due || p.createdAt);
      const key = d.toLocaleDateString('en-US', { month: 'short' });
      monthMap[key] = (monthMap[key] || 0) + (p.amount || 0);
    });
    const monthly = Object.entries(monthMap).slice(-7).map(([m, v]) => ({ m, v }));
    const totalRevenue    = payments.reduce((a, p) => a + (p.amount || 0), 0);
    const collectedAmount = payments.filter(p => p.status === 'paid').reduce((a, p) => a + (p.paid || p.amount || 0), 0);
    res.json({ success: true, stats: { monthly, totalRevenue, collectedAmount } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.patch('/api/payments/:id', auth, async (req, res) => {
  try {
    const { paid, method } = req.body;
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ success: false });
    payment.paid   = paid;
    payment.method = method || payment.method;
    payment.status = paid >= payment.amount ? 'paid' : paid > 0 ? 'partial' : 'pending';
    await payment.save();
    req.io.emit('payment:updated', { id: String(payment._id), status: payment.status, paid: payment.paid, method: payment.method });
    res.json({ success: true, payment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
app.delete('/api/payments/:id', auth, async (req, res) => {
  try {
    await Payment.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
/* ══════════════════════════════════════════════════════
   ROUTES — NOTIFICATIONS
══════════════════════════════════════════════════════ */

app.get('/api/notifications', auth, async (req, res) => {
  try {
    const query = req.user.role === 'admin'
      ? {}
      : { $or: [{ userId: req.user.id }, { targets: { $exists: true, $ne: [] } }] };
    const notifs = await Notification.find(query).sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, notifications: notifs.map(formatNotif) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/notifications', auth, async (req, res) => {
  try {
    const { title, msg, type, targets } = req.body;
    const ICON_MAP = { payment: '💳', absence: '📋', system: '🔔', alert: '⚠️' };
    const notif = await Notification.create({
      userId: req.user.id, type: type || 'system',
      icon: ICON_MAP[type] || '🔔', title, msg,
      tag: type || 'system', targets: targets || [],
    });
    const formatted = formatNotif(notif);
    req.io.emit('notification:new', formatted);
    res.json({ success: true, notification: formatted });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
app.patch('/api/notifications/read-all', auth, async (req, res) => {
  try {
    await Notification.updateMany({ read: false }, { read: true });
    req.io.emit('notification:read-all');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.patch('/api/notifications/:id/read', auth, async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { read: true });
    req.io.to(`user:${req.user.id}`).emit('notification:read', { id: req.params.id });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});



app.delete('/api/notifications/:id', auth, async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/notifications', auth, async (req, res) => {
  try {
    await Notification.deleteMany({});
    req.io.emit('notification:cleared');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ══════════════════════════════════════════════════════
   ROUTES — SETTINGS
══════════════════════════════════════════════════════ */

app.get('/api/settings', auth, async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create({});
    res.json({ success: true, settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/settings', auth, async (req, res) => {
  try {
    const { schoolName, city, address, email, phone, maxStudents } = req.body;
    let settings = await Settings.findOne();
    if (!settings) settings = new Settings();
    Object.assign(settings, { schoolName, city, address, email, phone, maxStudents });
    await settings.save();
    res.json({ success: true, settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ══════════════════════════════════════════════════════
   ROUTES MANQUANTES
══════════════════════════════════════════════════════ */

// 1. Archived users (students + teachers)

// GET /api/users/:id/profile

app.patch('/api/users/:id/archive', auth, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { actif: false });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/users/:id/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const sections = await Section.find({ studentIds: user._id });

    res.json({
      success: true,
      student: {
        name:      `${user.prenom || ''} ${user.nom || ''}`.trim() || user.email,
        email:     user.email,
        phone:     user.telephone || '—',
        language:  user.language  || '—',
        level:     user.level     || '—',
        schedule:  user.schedule  || '—',
        absences:  user.absences  || 0,
        notes:     user.notes     || '',
        status:    user.actif ? 'active' : 'pending',
        createdAt: user.createdAt,
        sections:  sections.map(s => ({
          id:       String(s._id),
          name:     s.name,
          language: s.language,
          level:    s.level,
          teacher:  s.teacher,
          time:     s.time,
          room:     s.room,
        })),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/users/:id/sections
app.get('/api/users/:id/sections', auth, async (req, res) => {
  try {
    const sections = await Section.find({ studentIds: req.params.id });
    res.json({
      success: true,
      sections: sections.map(s => ({
        id:       String(s._id),
        name:     s.name,
        language: s.language,
        level:    s.level,
        teacher:  s.teacher || '—',
        time:     s.time    || '—',
        room:     s.room    || '—',
        students: s.studentIds?.length || 0,
        capacity: s.capacity || 12,
      })),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/teachers/:id/profile  (profil enseignant)
app.get('/api/teachers/:id/profile', auth, async (req, res) => {
  try {
    const teacher = await User.findById(req.params.id).select('-password');
    if (!teacher) return res.status(404).json({ success: false });

    const sections = await Section.find({ teacherId: req.params.id });
    const studentCount = sections.reduce((a, s) => a + (s.studentIds?.length || 0), 0);

    res.json({
      success: true,
      teacher: {
        name:         `${teacher.prenom || ''} ${teacher.nom || ''}`.trim() || teacher.email,
        email:        teacher.email,
        phone:        teacher.telephone || '—',
        specialty:    teacher.specialty || '—',
        notes:        teacher.notes     || '',
        status:       teacher.actif ? 'active' : 'inactive',
        createdAt:    teacher.createdAt,
        studentCount,
        sections: sections.map(s => ({
          id:       String(s._id),
          name:     s.name,
          language: s.language,
          level:    s.level,
          time:     s.time     || '—',
          room:     s.room     || '—',
          students: s.studentIds?.length || 0,
          capacity: s.capacity || 12,
        })),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
// 2. Restore user
app.patch('/api/users/:id/restore', auth, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { actif: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 3. Créer un paiement
app.post('/api/payments', auth, async (req, res) => {
  try {
    const { studentId, student, language, level, amount, due, method } = req.body;
    const payment = await Payment.create({
      studentId, student, language, level,
      amount, paid: 0,
      due: due || undefined,
      status: 'pending',
      method: method || '—',
    });
    res.json({ success: true, payment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
/* ══════════════════════════════════════════════════════
   ROUTES — SECRÉTAIRE
══════════════════════════════════════════════════════ */

// ── Profil ──
app.get('/api/secretaire/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ success: true, user });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.put('/api/secretaire/profile', auth, async (req, res) => {
  try {
    const { nom, prenom, email, telephone } = req.body;
    await User.findByIdAndUpdate(req.user.id, { nom, prenom, email, telephone });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.patch('/api/secretaire/change-password', auth, async (req, res) => {
  try {
    const { currentPwd, newPwd } = req.body;
    const user = await User.findById(req.user.id);
    if (!(await bcrypt.compare(currentPwd, user.password)))
      return res.status(400).json({ success: false, message: 'Wrong password' });
    user.password = await bcrypt.hash(newPwd, 10);
    await user.save();
    res.json({ success: true });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ── Sections ──
app.get('/api/secretaire/sections', auth, async (req, res) => {
  try {
    const sections = await Section.find();
    const mapped = sections.map(s => ({
      ...s.toJSON(),
      id:       String(s._id),
      students: s.studentIds?.length || 0,
    }));
    res.json({ success: true, sections: mapped });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.post('/api/secretaire/sections', auth, async (req, res) => {
  try {
    const { name, language, level, teacher, teacherId, time, room, capacity } = req.body;
    const section = await Section.create({
      name, language, level, teacher,
      teacherId:  teacherId || undefined,
      time, room, capacity: capacity || 12,
      studentIds: [],
    });
    req.io.emit('section:created', {
      id: String(section._id), name: section.name, language: section.language,
      level: section.level, teacher: section.teacher, teacherId: String(section.teacherId || ''),
      students: 0, capacity: section.capacity, time: section.time, room: section.room,
    });
    res.json({ success: true, section });

  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.delete('/api/secretaire/sections/:id', auth, async (req, res) => {
  try {
   await Section.findByIdAndDelete(req.params.id);
    req.io.emit('section:deleted', { id: req.params.id });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ── Étudiants ──
app.post('/api/secretaire/students/register', auth, async (req, res) => {
  try {
    const { nom, prenom, email, telephone, language, level, section, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ success: false, message: 'Email déjà utilisé' });
    const hashed = await bcrypt.hash(password || 'Changeme123!', 10);
    const user = await User.create({
      nom, prenom, email, telephone,
      language, level, section,
      password: hashed,
      role:     'etudiant',
      actif:    false,
    });
    req.io.emit('student:added', user);
    res.json({ success: true, user });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.patch('/api/secretaire/students/:id/accept', auth, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { actif: true });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.delete('/api/secretaire/students/:id/reject', auth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ── Absences ──
app.get('/api/secretaire/absences', auth, async (req, res) => {
  try {
    const absences = await Absence.find().sort({ date: -1 });
    const formatted = absences.map(a => ({
      id:        String(a._id),
      student:   a.name,
      section:   a.level,
      date:      a.date,
      session:   a.session,
      justified: a.justified,
    }));
    res.json({ success: true, absences: formatted });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});
app.post('/api/secretaire/absences', auth, async (req, res) => {
  try {
    const { student, studentId, section, session, date, justified } = req.body;
    const absence = await Absence.create({
      name:      student,
      studentId: studentId || undefined,
      level:     section,
      session, date,
      justified: justified || false,
    });
    if (studentId) {
      const updated = await User.findByIdAndUpdate(
        studentId, 
        { $inc: { absences: 1 } }, 
        { new: true }
      );
      // ✅ Émission globale (admin voit le compteur mis à jour)
req.io.emit('absence:marked', { 
  studentId, 
  absent: true,           // ← AJOUTER
  totalAbsences: updated?.absences || 0 
});
      // ✅ Notifie l'étudiant
      req.io.to(`user:${studentId}`).emit('absence:marked', { studentId, date, session });
      // ✅ Notifie le parent
      const parentUser = await User.findOne({ linkedStudent: studentId });
      if (parentUser) {
        req.io.to(`user:${parentUser._id}`).emit('absence:marked', { 
          studentId, date, session 
        });
      }
    }
    res.json({ success: true, absence });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});
app.patch('/api/secretaire/absences/:id/justify', auth, async (req, res) => {
  try {
    const absence = await Absence.findById(req.params.id);
    if (!absence) return res.status(404).json({ success: false });
    absence.justified = !absence.justified;
    await absence.save();
    res.json({ success: true, justified: absence.justified });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.delete('/api/secretaire/absences/:id', auth, async (req, res) => {
  try {
    const absence = await Absence.findByIdAndDelete(req.params.id);
    if (!absence) return res.status(404).json({ success: false });
    if (absence.studentId)
      await User.findByIdAndUpdate(absence.studentId, { $inc: { absences: -1 } });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ── Timetable ──
app.get('/api/secretaire/timetable', auth, async (req, res) => {
  try {
    const { day } = req.query;
    const query = { actif: true };
    if (day !== undefined) query.dayOfWeek = Number(day);
    const emplois = await Timetable.find(query).sort({ startTime: 1 });
    const formatted = emplois.map(e => ({
      id:      String(e._id),
      time:    `${e.startTime}–${e.endTime}`,
      subject: e.subject || e.language || '—',
      section: e.sectionName || '—',
      teacher: e.teacherName || '—',
      room:    e.room || '—',
    }));
    res.json({ success: true, timetable: formatted });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.post('/api/secretaire/timetable', auth, async (req, res) => {
  try {
    const { section, subject, teacher, room, startTime, endTime, dayOfWeek } = req.body;
    const emploi = await Timetable.create({
      sectionName:  section,
      subject,
      teacherName:  teacher,
      room, startTime, endTime,
      dayOfWeek,
      actif: true,
    });
    res.json({ success: true, emploi });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.delete('/api/secretaire/timetable/:id', auth, async (req, res) => {
  try {
    await Timetable.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ── Notifications ──
app.get('/api/secretaire/notifications', auth, async (req, res) => {
  try {
    const notifs = await Notification.find().sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, notifications: notifs.map(formatNotif) });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.patch('/api/secretaire/notifications/read-all', auth, async (req, res) => {
  try {
    await Notification.updateMany({ read: false }, { read: true });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.patch('/api/secretaire/notifications/:id/read', auth, async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { read: true });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.delete('/api/secretaire/notifications/:id', auth, async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ── Messages ──
app.get('/api/secretaire/messages', auth, async (req, res) => {
  try {
    const messages = await Message.find({ recipient: req.user.id })
      .populate('sender', 'prenom nom role')
      .sort({ createdAt: -1 })
      .limit(50);
    const formatted = messages.map(m => ({
      id:      String(m._id),
      from:    m.sender ? `${m.sender.prenom || ''} ${m.sender.nom || ''}`.trim() : 'Inconnu',
      avatar:  m.sender ? `${m.sender.prenom?.[0] || ''}${m.sender.nom?.[0] || ''}`.toUpperCase() : '?',
      subject: m.subject,
      preview: m.body.slice(0, 80) + (m.body.length > 80 ? '…' : ''),
      body:    m.body,
      tag:     m.tag,
      read:    m.read,
      starred: m.starred,
      time:    new Date(m.createdAt).toLocaleDateString('fr-DZ'),
    }));
    res.json({ success: true, messages: formatted });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.patch('/api/secretaire/messages/:id/read', auth, async (req, res) => {
  try {
    await Message.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user.id },
      { read: true }
    );
    res.json({ success: true });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.patch('/api/secretaire/messages/:id/star', auth, async (req, res) => {
  try {
    const msg = await Message.findOne({ _id: req.params.id, recipient: req.user.id });
    if (!msg) return res.status(404).json({ success: false });
    msg.starred = !msg.starred;
    await msg.save();
    res.json({ success: true, starred: msg.starred });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.delete('/api/secretaire/messages/:id', auth, async (req, res) => {
  try {
    await Message.findOneAndDelete({ _id: req.params.id, recipient: req.user.id });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.post('/api/secretaire/messages/:id/reply', auth, async (req, res) => {
  try {
    const { body } = req.body;
    const original = await Message.findById(req.params.id).populate('sender');
    if (!original) return res.status(404).json({ success: false });
    await Message.create({
      sender:    req.user.id,
      recipient: original.sender._id,
      subject:   `Re: ${original.subject}`,
      body,
      tag:       original.tag,
    });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.post('/api/messages', auth, async (req, res) => {
  try {
    const { recipientId, subject, body, tag } = req.body;
    const msg = await Message.create({
      sender:    req.user.id,
      recipient: recipientId,
      subject, body,
      tag: tag || 'sys',
    });
    req.io.to(`user:${recipientId}`).emit('message:new', {
      id:      String(msg._id),
      subject: msg.subject,
      preview: body.slice(0, 80),
      tag:     msg.tag,
    });
    res.json({ success: true, message: msg });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message)
      return res.status(400).json({ success: false, message: 'All fields required' });
    // Optionnel : envoyer un email avec nodemailer
    console.log('Contact form:', { name, email, message });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    // Ne pas révéler si l'email existe ou non (sécurité)
    if (!user) return res.json({ success: true });
    // Optionnel : générer un token et envoyer un email
    console.log('Password reset requested for:', email);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
app.patch('/api/payments/:id/pay', auth, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ success: false });
    payment.paid   = payment.amount;
    payment.status = 'paid';
    payment.method = req.body.method || payment.method;
    await payment.save();
    req.io.emit('payment:updated', { id: String(payment._id), status: 'paid', paid: payment.paid });
    res.json({ success: true, payment });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});
// ══ TEACHER ROUTES ══

app.get('/api/teacher/sections', auth, async (req, res) => {
  try {
    const sections = await Section.find({ teacherId: req.user.id })
      .populate('studentIds', 'prenom nom email level absences actif telephone language');
    res.json({ success: true, sections });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.get('/api/teacher/sections/:sectionId/students', auth, async (req, res) => {
  try {
    const section = await Section.findById(req.params.sectionId)
      .populate('studentIds', 'prenom nom email level absences actif telephone language');
    if (!section) return res.status(404).json({ success: false });
    res.json({ success: true, students: section.studentIds || [] });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.post('/api/teacher/notes', auth, async (req, res) => {
  try {
    const { etudiantUserId, etudiantId, typeEvaluation, note, noteMax, commentaire } = req.body;
    const userId = etudiantUserId || etudiantId;

    const Etudiant = require('./models/Etudiant');
    let etudiantDoc = await Etudiant.findOne({ user: userId });
    if (!etudiantDoc) etudiantDoc = await Etudiant.create({ user: userId });

    const newNote = await Note.create({
      etudiant:       etudiantDoc._id,
      typeEvaluation: typeEvaluation || 'Contrôle',
      note:           Number(note),
      noteMax:        Number(noteMax) || 20,
      commentaire:    commentaire || '',
      dateEvaluation: new Date(),
    });

    const payload = {
      studentId: userId,
      subject:   typeEvaluation,
      note:      Number(note),
      noteMax:   Number(noteMax) || 20,
    };

    req.io.to(`user:${userId}`).emit('note:added', payload);
    req.io.emit('note:added', payload);

    const parent = await User.findOne({ linkedStudent: userId });
    if (parent) req.io.to(`user:${parent._id}`).emit('note:added', payload);

    res.json({ success: true, note: newNote });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
app.post('/api/teacher/exams', auth, async (req, res) => {
  try {
    const exam = await Exam.create({ ...req.body, createdBy: req.user.id });
    req.io.emit('exam:added', exam);
    res.json({ success: true, exam });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.get('/api/teacher/exams', auth, async (req, res) => {
  try {
    const exams = await Exam.find({ createdBy: req.user.id }).sort({ date: 1 });
    res.json({ success: true, exams });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});
// À AJOUTER après app.get('/api/teacher/exams'...)
app.delete('/api/teacher/exams/:id', auth, async (req, res) => {
  try {
    await Exam.findOneAndDelete({ _id: req.params.id, createdBy: req.user.id });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.get('/api/teacher/sections/:sectionId/notes', auth, async (req, res) => {
  try {
    const section = await Section.findById(req.params.sectionId);
    if (!section) return res.status(404).json({ success: false });
    const Etudiant = require('./models/Etudiant');
    const etudiants = await Etudiant.find({ user: { $in: section.studentIds } });
    const notes = await Note.find({ etudiant: { $in: etudiants.map(e => e._id) } })
      .populate({ path: 'etudiant', populate: { path: 'user', select: 'prenom nom email' } })
      .sort({ dateEvaluation: -1 });
    res.json({ success: true, notes });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.get('/api/teacher/sections/:sectionId/absences', auth, async (req, res) => {
  try {
    const section = await Section.findById(req.params.sectionId);
    if (!section) return res.status(404).json({ success: false });
    const absences = await Absence.find({ studentId: { $in: section.studentIds } }).sort({ date: -1 });
    res.json({ success: true, absences });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});
/* ══════════════════════════════════════════════════════
   SOCKET.IO
══════════════════════════════════════════════════════ */
io.on('connection', (socket) => {
  console.log('🔌 Socket connecté:', socket.id);

  socket.on('join', (userId) => {
    if (userId) {
      socket.join(`user:${userId}`);
      console.log(`👤 Socket ${socket.id} → room user:${userId}`);
    }
  });

  // ✅ NOUVEAU
  socket.on('join-role', (role) => {
    if (role) {
      socket.join(`role:${role}`);
      console.log(`🎭 Socket ${socket.id} → room role:${role}`);
    }
  });

  socket.on('disconnect', () => {
    console.log('🔌 Socket déconnecté:', socket.id);
  });
});
/* ══════════════════════════════════════════════════════
   DÉMARRAGE
══════════════════════════════════════════════════════ */
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/langschool')
  .then(() => {
    console.log('✅ MongoDB connecté');
   server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Serveur accessible sur http://192.168.130.115:${PORT}`);
});
  })
  .catch(err => {
    console.error('❌ MongoDB erreur:', err);
    process.exit(1);
  });