const express = require("express");
const router  = express.Router();
const {
  getProfesseurs,
  getProfesseur,
  updateProfesseur,
  getMyProfile,
  updateMyProfile,
  uploadPhoto,
} = require("../controllers/professeurController");
const { protect, authorize } = require("../middleware/auth");

router.use(protect);

/* ══════════════════════════════════════════════════════════════
   Routes statiques AVANT /:id
══════════════════════════════════════════════════════════════ */

// ✅ Le prof peut lire/modifier son propre profil
// (utilisé par TeacherDashboard → GET /api/users/me)
router.get("/me",       getMyProfile);
router.put("/me",       updateMyProfile);

// ✅ Upload photo de profil (POST /api/professeurs/me/photo)
router.post("/me/photo", uploadPhoto);

/* ══════════════════════════════════════════════════════════════
   CRUD
══════════════════════════════════════════════════════════════ */

// Liste tous les profs — admin uniquement
router.get("/",    authorize("admin", "secretaire"), getProfesseurs);

// Fiche d'un prof — admin, secrétaire, ou le prof lui-même
router.get("/:id", authorize("admin", "secretaire", "professeur"), getProfesseur);

// Mise à jour — admin ou le prof lui-même
router.put("/:id", authorize("admin", "professeur"), updateProfesseur);

module.exports = router;