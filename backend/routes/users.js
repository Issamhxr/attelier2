// routes/users.js
const express = require("express");
const router  = express.Router();
const User    = require("../models/User");
const { protect, authorize } = require("../middleware/auth");
const {
  validateStep,
  createUser,
  getStudents,
  getArchived,
  getGlobalStats,
  getMe,
  updateMe,
  changePassword,
  updateUser,
  archiveUser,
  restoreUser,
} = require("../controllers/userController");

/* ══════════════════════════════════════════
   ROUTES FIXES — sans paramètre (en premier)
══════════════════════════════════════════ */

// Auth & profil connecté
router.get("/me",                protect, getMe);
router.put("/me",                protect, updateMe);
router.patch("/change-password", protect, changePassword);

// Création & validation
router.post("/validate-step", validateStep);
router.post("/",               protect, createUser);

// Listes spéciales
router.get("/students",  protect, getStudents);
router.get("/archived",  protect, getArchived);
router.get("/stats",     protect, getGlobalStats);

// Enseignants actifs
router.get("/teachers", protect, async (req, res) => {
  try {
    const teachers = await User.find({ role: "professeur", actif: true })
      .select("_id nom prenom email telephone actif specialty hours classes createdAt")
      .lean();
    const formatted = teachers.map(t => ({
      ...t,
      id:     t._id,
      name:   `${t.prenom || ""} ${t.nom || ""}`.trim(),
      rating: t.rating || 4.5,
      joined: t.createdAt ? new Date(t.createdAt).toLocaleDateString("fr-DZ") : "—",
    }));
    return res.json({ success: true, users: formatted, teachers: formatted });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Par rôle
router.get("/role/:role", protect, async (req, res) => {
  try {
    const users = await User.find({ role: req.params.role })
      .select("_id nom prenom email telephone actif specialty hours language level section absences department createdAt")
      .sort({ createdAt: -1 })
      .lean();
    const formatted = users.map(u => ({
      ...u,
      id:   u._id,
      name: `${u.prenom || ""} ${u.nom || ""}`.trim(),
    }));
    return res.json({ success: true, users: formatted });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

/* ══════════════════════════════════════════
   ROUTES AVEC PARAMÈTRE /:id — en dernier
══════════════════════════════════════════ */
router.put("/:id",            protect, updateUser);
router.patch("/:id/archive",  protect, archiveUser);
router.patch("/:id/restore",  protect, restoreUser);

module.exports = router;