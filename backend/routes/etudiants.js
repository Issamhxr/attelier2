const express   = require("express");
const router    = express.Router();
const Etudiant  = require("../models/Etudiant");
const {
  getEtudiants,
  getEtudiant,
  updateEtudiant,
  deleteEtudiant,
} = require("../controllers/etudiantController");
const { protect, authorize } = require("../middleware/auth");

router.use(protect);

// ⚠️ Routes statiques AVANT /:id
router.get("/by-user/:userId", async (req, res) => {
  try {
    let etudiant = await Etudiant.findOne({ user: req.params.userId })
      .populate("coursInscrits", "nom langue niveau")
      .populate("notes");

    // Si pas trouvé → créer automatiquement
    if (!etudiant) {
      const count = await Etudiant.countDocuments();
      etudiant = await Etudiant.create({
        user:          req.params.userId,
        matricule:     `ETU-${String(count + 1).padStart(4, '0')}`,
        coursInscrits: [],
        notes:         [],
        paiements:     [],
      });
    }

    res.json({ success: true, data: etudiant });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Routes avec paramètre /:id — en dernier
router.get("/",    authorize("admin", "professeur"), getEtudiants);
router.get("/:id", getEtudiant);
router.put("/:id", updateEtudiant);
router.delete("/:id", authorize("admin"), deleteEtudiant);

module.exports = router;