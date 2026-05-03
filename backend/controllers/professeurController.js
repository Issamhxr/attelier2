const User    = require("../models/User");
const path    = require("path");
const fs      = require("fs");
const multer  = require("multer");

/* ══════════════════════════════════════════════════════════════
   MULTER — stockage photo de profil
══════════════════════════════════════════════════════════════ */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "../uploads/avatars");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `prof_${req.user.id}_${Date.now()}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 3 * 1024 * 1024 }, // 3 MB max
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/"))
      return cb(new Error("Images only"), false);
    cb(null, true);
  },
}).single("photo");

/* ══════════════════════════════════════════════════════════════
   GET /me  — profil du professeur connecté
   Utilisé par TeacherDashboard → fetch(`${BASE}/users/me`)
══════════════════════════════════════════════════════════════ */
exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password").lean();
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ══════════════════════════════════════════════════════════════
   PUT /me  — mise à jour du profil
══════════════════════════════════════════════════════════════ */
exports.updateMyProfile = async (req, res) => {
  try {
    const { fname, lname, email, phone, bio, address } = req.body;

    const updated = await User.findByIdAndUpdate(
      req.user.id,
      {
        ...(fname   && { prenom:    fname   }),
        ...(lname   && { nom:       lname   }),
        ...(email   && { email              }),
        ...(phone   && { telephone: phone   }),
        ...(bio     && { notes:     bio     }),
        ...(address && { adresse:   address }),
      },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updated)
      return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, user: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ══════════════════════════════════════════════════════════════
   POST /me/photo  — upload photo de profil
   Retourne { success, photoUrl } utilisé par TeacherDashboard
══════════════════════════════════════════════════════════════ */
exports.uploadPhoto = (req, res) => {
  upload(req, res, async (err) => {
    if (err)
      return res.status(400).json({ success: false, message: err.message });

    if (!req.file)
      return res.status(400).json({ success: false, message: "No file uploaded" });

    // URL publique (adapte le chemin selon ton setup Express)
    const photoUrl = `/uploads/avatars/${req.file.filename}`;

    try {
      await User.findByIdAndUpdate(req.user.id, { photo: photoUrl });
      res.json({ success: true, photoUrl });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  });
};

/* ══════════════════════════════════════════════════════════════
   GET /  — liste tous les professeurs (admin / secrétaire)
══════════════════════════════════════════════════════════════ */
exports.getProfesseurs = async (req, res) => {
  try {
    const teachers = await User.find({ role: "professeur" })
      .select("-password")
      .lean();

    const mapped = teachers.map(t => ({
      id:        t._id,
      name:      `${t.prenom || ""} ${t.nom || ""}`.trim() || t.email,
      specialty: t.specialty || "—",
      email:     t.email,
      phone:     t.telephone || "—",
      classes:   t.classes   || [],
      students:  t.students  || 0,
      hours:     t.hours     || 0,
      rating:    t.rating    || "—",
      joined:    t.joined    ||
        new Date(t.createdAt).toLocaleDateString("en-US", {
          month: "short", year: "numeric",
        }),
    }));

    res.json({ success: true, teachers: mapped });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ══════════════════════════════════════════════════════════════
   GET /:id  — fiche d'un professeur
══════════════════════════════════════════════════════════════ */
exports.getProfesseur = async (req, res) => {
  try {
    // Un prof ne peut voir que son propre profil
    if (
      req.user.role === "professeur" &&
      String(req.user.id) !== String(req.params.id)
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied: you can only view your own profile",
      });
    }

    const user = await User.findById(req.params.id)
      .select("-password")
      .lean();

    if (!user || user.role !== "professeur")
      return res.status(404).json({ success: false, message: "Teacher not found" });

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ══════════════════════════════════════════════════════════════
   PUT /:id  — mise à jour par admin ou par le prof lui-même
══════════════════════════════════════════════════════════════ */
exports.updateProfesseur = async (req, res) => {
  try {
    // Un prof ne peut modifier que son propre profil
    if (
      req.user.role === "professeur" &&
      String(req.user.id) !== String(req.params.id)
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // Champs interdits à la modification directe
    const { password, role, ...allowed } = req.body;

    const updated = await User.findByIdAndUpdate(
      req.params.id,
      allowed,
      { new: true, runValidators: true }
    ).select("-password");

    if (!updated)
      return res.status(404).json({ success: false, message: "Teacher not found" });

    res.json({ success: true, user: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};