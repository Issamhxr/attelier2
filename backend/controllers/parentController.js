// controllers/parentController.js
const User   = require('../models/User');
const Parent = require('../models/Parent');
const bcrypt = require('bcryptjs');

/* ══════════════════════════════════════════
   GET /api/parents
   Liste tous les parents (admin/secrétaire)
══════════════════════════════════════════ */
exports.getParents = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let parents = await Parent.find()
      .populate('user', 'nom prenom email telephone actif createdAt')
      .populate('children.student', 'nom prenom email language level section absences')
      .sort({ createdAt: -1 })
      .lean();

    // Filtre recherche
    if (search) {
      const q = search.toLowerCase();
      parents = parents.filter(p => {
        const name = `${p.user?.prenom || ''} ${p.user?.nom || ''}`.toLowerCase();
        return name.includes(q) || p.user?.email?.toLowerCase().includes(q);
      });
    }

    const total    = parents.length;
    const paginated = parents.slice(skip, skip + parseInt(limit));

    const formatted = paginated.map(p => ({
      id:         p._id,
      userId:     p.user?._id,
      name:       `${p.user?.prenom || ''} ${p.user?.nom || ''}`.trim(),
      email:      p.user?.email,
      phone:      p.user?.telephone || '—',
      actif:      p.user?.actif,
      profession: p.profession || '—',
      children:   (p.children || []).map(c => ({
        id:       c.student?._id,
        name:     `${c.student?.prenom || ''} ${c.student?.nom || ''}`.trim(),
        language: c.student?.language,
        level:    c.student?.level,
        section:  c.student?.section,
        absences: c.student?.absences || 0,
        relation: c.relation,
      })),
      notes:      p.notes,
      createdAt:  p.createdAt,
    }));

    return res.json({
      success: true,
      count:   total,
      page:    parseInt(page),
      pages:   Math.ceil(total / parseInt(limit)),
      parents: formatted,
    });
  } catch (err) {
    next(err);
  }
};

/* ══════════════════════════════════════════
   GET /api/parents/:id
══════════════════════════════════════════ */
exports.getParent = async (req, res, next) => {
  try {
    const parent = await Parent.findById(req.params.id)
      .populate('user', 'nom prenom email telephone actif adresse createdAt')
      .populate('children.student', 'nom prenom email language level section absences');

    if (!parent) {
      return res.status(404).json({ success: false, message: 'Parent introuvable.' });
    }

    return res.json({ success: true, parent });
  } catch (err) {
    next(err);
  }
};

/* ══════════════════════════════════════════
   GET /api/parents/my-children
   Pour un parent connecté → voir ses enfants
══════════════════════════════════════════ */
exports.getMyChildren = async (req, res, next) => {
  try {
    const parent = await Parent.findOne({ user: req.user.id })
      .populate({
        path: 'children.student',
        select: 'nom prenom email language level section absences actif',
      });

    if (!parent) {
      return res.status(404).json({ success: false, message: 'Profil parent introuvable.' });
    }

    const children = parent.children.map(c => ({
      id:       c.student?._id,
      name:     `${c.student?.prenom || ''} ${c.student?.nom || ''}`.trim(),
      email:    c.student?.email,
      language: c.student?.language,
      level:    c.student?.level,
      section:  c.student?.section,
      absences: c.student?.absences || 0,
      actif:    c.student?.actif,
      relation: c.relation,
    }));

    return res.json({ success: true, children });
  } catch (err) {
    next(err);
  }
};

/* ══════════════════════════════════════════
   POST /api/parents
   Créer un parent + compte User
══════════════════════════════════════════ */
exports.createParent = async (req, res, next) => {
  try {
    const { nom, prenom, email, telephone, password,
            profession, notes, childrenIds, relation } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email obligatoire.' });
    }

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(409).json({ success: false, message: 'Email déjà utilisé.' });
    }

    // Créer le User
    const user = await User.create({
      nom:       nom       || '',
      prenom:    prenom    || '',
      email:     email.toLowerCase(),
      password:  password  || 'parent123',
      role:      'parent',
      telephone: telephone || '',
      actif:     true,
    });

    // Construire la liste des enfants
    const children = [];
    if (childrenIds && Array.isArray(childrenIds)) {
      for (const sid of childrenIds) {
        const student = await User.findById(sid);
        if (student && student.role === 'etudiant') {
          children.push({ student: sid, relation: relation || 'Autre' });
        }
      }
    }

    const parent = await Parent.create({
      user:       user._id,
      children,
      profession: profession || '',
      notes:      notes      || '',
    });

    // Envoyer email de bienvenue
    try {
      const { sendWelcomeEmail } = require('../services/emailService');
      await sendWelcomeEmail({
        to:   user.email,
        name: `${user.prenom} ${user.nom}`,
        role: 'parent',
        tempPassword: password || 'parent123',
      });
    } catch (_) {}

    return res.status(201).json({
      success: true,
      message: 'Parent créé avec succès.',
      parent: {
        id:     parent._id,
        userId: user._id,
        name:   `${user.prenom} ${user.nom}`.trim(),
        email:  user.email,
        phone:  user.telephone,
      },
    });
  } catch (err) {
    next(err);
  }
};

/* ══════════════════════════════════════════
   PUT /api/parents/:id
   Modifier un parent
══════════════════════════════════════════ */
exports.updateParent = async (req, res, next) => {
  try {
    const { nom, prenom, telephone, profession, notes } = req.body;

    const parent = await Parent.findById(req.params.id);
    if (!parent) {
      return res.status(404).json({ success: false, message: 'Parent introuvable.' });
    }

    // Mettre à jour le User associé
    await User.findByIdAndUpdate(parent.user, {
      ...(nom       && { nom }),
      ...(prenom    && { prenom }),
      ...(telephone && { telephone }),
    });

    if (profession !== undefined) parent.profession = profession;
    if (notes      !== undefined) parent.notes      = notes;
    await parent.save();

    return res.json({ success: true, message: 'Parent mis à jour.' });
  } catch (err) {
    next(err);
  }
};

/* ══════════════════════════════════════════
   POST /api/parents/:id/children
   Ajouter un enfant à un parent
══════════════════════════════════════════ */
exports.addChild = async (req, res, next) => {
  try {
    const { studentId, relation } = req.body;

    if (!studentId) {
      return res.status(400).json({ success: false, message: 'ID étudiant requis.' });
    }

    const parent  = await Parent.findById(req.params.id);
    if (!parent)  return res.status(404).json({ success: false, message: 'Parent introuvable.' });

    const student = await User.findById(studentId);
    if (!student || student.role !== 'etudiant') {
      return res.status(404).json({ success: false, message: 'Étudiant introuvable.' });
    }

    // Vérifier si déjà lié
    const already = parent.children.find(c => c.student.toString() === studentId);
    if (already) {
      return res.status(409).json({ success: false, message: 'Cet étudiant est déjà lié à ce parent.' });
    }

    parent.children.push({ student: studentId, relation: relation || 'Autre' });
    await parent.save();

    return res.json({ success: true, message: 'Enfant ajouté.' });
  } catch (err) {
    next(err);
  }
};

/* ══════════════════════════════════════════
   DELETE /api/parents/:id/children/:studentId
   Retirer un enfant
══════════════════════════════════════════ */
exports.removeChild = async (req, res, next) => {
  try {
    const parent = await Parent.findById(req.params.id);
    if (!parent) return res.status(404).json({ success: false, message: 'Parent introuvable.' });

    parent.children = parent.children.filter(
      c => c.student.toString() !== req.params.studentId
    );
    await parent.save();

    return res.json({ success: true, message: 'Enfant retiré.' });
  } catch (err) {
    next(err);
  }
};

/* ══════════════════════════════════════════
   DELETE /api/parents/:id
   Supprimer un parent (désactive le compte)
══════════════════════════════════════════ */
exports.deleteParent = async (req, res, next) => {
  try {
    const parent = await Parent.findById(req.params.id);
    if (!parent) return res.status(404).json({ success: false, message: 'Parent introuvable.' });

    await User.findByIdAndUpdate(parent.user, { actif: false, archivedAt: new Date() });
    return res.json({ success: true, message: 'Parent désactivé.' });
  } catch (err) {
    next(err);
  }
};

/* ══════════════════════════════════════════
   GET /api/parents/my-profile
   Parent connecté → son profil
══════════════════════════════════════════ */
exports.getMyProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    const parent = await Parent.findOne({ user: req.user.id })
      .populate('children.student', 'nom prenom email language level section absences actif');

    return res.json({ success: true, user, parent });
  } catch (err) {
    next(err);
  }
};