const Section = require('../models/Section');
const User    = require('../models/User');

exports.getSections = async (req, res) => {
  try {
    const sections = await Section.find().populate('teacherId', 'nom prenom email telephone').lean();
    return res.json({
      success: true,
      sections: sections.map(s => ({
        id: s._id, name: s.name, language: s.language, level: s.level,
        teacher: s.teacherId ? `${s.teacherId.prenom || ''} ${s.teacherId.nom || ''}`.trim() : s.teacherName || '—',
        teacherId: s.teacherId?._id || s.teacherId,
        students: s.studentsCount || 0, capacity: s.capacity,
        time: s.time || '—', room: s.room || '—',
        ageGroup: s.ageGroup || 'tous',
      })),
    });
  } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

exports.createSection = async (req, res) => {
  try {
    const { name, language, level, capacity, teacherId, teacher, time, room, ageGroup } = req.body;
    if (!name || !language || !level) return res.status(400).json({ success: false, message: 'Nom, langue et niveau obligatoires.' });

    const exists = await Section.findOne({ name: name.trim() });
    if (exists) return res.status(409).json({ success: false, message: 'Une section avec ce nom existe déjà.' });

    let resolvedTeacherId = null, resolvedTeacherName = teacher || '';
    if (teacherId) {
      const prof = await User.findById(teacherId).select('nom prenom actif');
      if (prof) { resolvedTeacherId = prof._id; resolvedTeacherName = `${prof.prenom || ''} ${prof.nom || ''}`.trim(); }
    }

    const section = await Section.create({
      name: name.trim(), language, level, capacity: parseInt(capacity) || 12,
      teacherId: resolvedTeacherId, teacherName: resolvedTeacherName, teacher: resolvedTeacherName,
      time: time || '', room: room || '', studentsCount: 0,
      ageGroup: ageGroup || 'tous', actif: true,
    });

    return res.status(201).json({
      success: true, message: 'Section créée.',
      section: { _id: section._id, id: section._id, name: section.name, language: section.language, level: section.level, teacher: resolvedTeacherName, teacherId: resolvedTeacherId, capacity: section.capacity, time: section.time, room: section.room, students: 0 },
    });
  } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

exports.updateSection = async (req, res) => {
  try {
    const { name, language, level, capacity, teacherId, teacher, time, room, ageGroup } = req.body;
    const id = req.params.id;
    const updates = {};
    if (name)       updates.name     = name.trim();
    if (language)   updates.language = language;
    if (level)      updates.level    = level;
    if (capacity)   updates.capacity = parseInt(capacity);
    if (time !== undefined) updates.time = time;
    if (room !== undefined) updates.room = room;
    if (ageGroup)   updates.ageGroup = ageGroup;

    if (teacherId) {
      const prof = await User.findById(teacherId).select('nom prenom');
      if (prof) { updates.teacherId = prof._id; updates.teacherName = `${prof.prenom || ''} ${prof.nom || ''}`.trim(); updates.teacher = updates.teacherName; }
    } else if (teacher !== undefined) {
      updates.teacherName = teacher; updates.teacher = teacher;
    }

    const section = await Section.findByIdAndUpdate(id, updates, { new: true });
    if (!section) return res.status(404).json({ success: false, message: 'Section introuvable.' });
    return res.json({ success: true, message: 'Section mise à jour.', section });
  } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

exports.deleteSection = async (req, res) => {
  try {
    const section = await Section.findByIdAndDelete(req.params.id);
    if (!section) return res.status(404).json({ success: false, message: 'Section introuvable.' });
    return res.json({ success: true, message: 'Section supprimée.' });
  } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

exports.getAvailableRooms = async (req, res) => {
  try {
    const ALL_ROOMS = ['A101','A102','A103','A104','B101','B102','B103','B104','C101','C102','C201','C202','Salle Info 1','Salle Info 2','Amphi A','Amphi B'];
    const sections  = await Section.find().select('room').lean();
    const usedRooms = sections.map(s => s.room).filter(Boolean);
    return res.json({ success: true, rooms: ALL_ROOMS.map(r => ({ name: r, available: !usedRooms.includes(r) })), available: ALL_ROOMS.filter(r => !usedRooms.includes(r)), used: usedRooms });
  } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

exports.getAvailableSlots = async (req, res) => {
  try {
    const ALL_SLOTS = [
      'Lun 08h00–09h30','Lun 09h45–11h15','Lun 11h30–13h00','Lun 14h00–15h30','Lun 15h45–17h15',
      'Mar 08h00–09h30','Mar 09h45–11h15','Mar 11h30–13h00','Mar 14h00–15h30','Mar 15h45–17h15',
      'Mer 08h00–09h30','Mer 09h45–11h15','Mer 11h30–13h00','Mer 14h00–15h30','Mer 15h45–17h15',
      'Jeu 08h00–09h30','Jeu 09h45–11h15','Jeu 11h30–13h00','Jeu 14h00–15h30','Jeu 15h45–17h15',
      'Ven 08h00–09h30','Ven 09h45–11h15','Ven 11h30–13h00','Ven 14h00–15h30','Ven 15h45–17h15',
      'Sam 08h00–09h30','Sam 09h45–11h15','Sam 11h30–13h00',
      'Lun/Mer 08h00–09h30','Lun/Mer 09h45–11h15','Lun/Mer 14h00–15h30',
      'Mar/Jeu 08h00–09h30','Mar/Jeu 09h45–11h15','Mar/Jeu 14h00–15h30',
      'Mer/Ven 08h00–09h30','Mer/Ven 09h45–11h15','Mer/Ven 14h00–15h30',
    ];
    const sections  = await Section.find().select('time').lean();
    const usedSlots = sections.map(s => s.time).filter(Boolean);
    return res.json({ success: true, slots: ALL_SLOTS.map(s => ({ name: s, available: !usedSlots.includes(s) })), available: ALL_SLOTS.filter(s => !usedSlots.includes(s)), used: usedSlots });
  } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

exports.getTeachers = async (req, res) => {
  try {
    const teachers = await User.find({ role: 'professeur', actif: true })
      .select('_id nom prenom email telephone specialty').lean();
    return res.json({ success: true, users: teachers.map(t => ({ ...t, actif: true })) });
  } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};