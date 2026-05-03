const express = require("express");
const router  = express.Router();
const ctrl    = require("../controllers/sectionController");
const Section = require("../models/Section");
const { protect, authorize } = require("../middleware/auth");

router.use(protect);

// ⚠️ Routes statiques AVANT /:id
router.get("/available-rooms", authorize("secretaire", "admin"), ctrl.getAvailableRooms);
router.get("/available-slots", authorize("secretaire", "admin"), ctrl.getAvailableSlots);
router.get("/teachers",        authorize("secretaire", "admin"), ctrl.getTeachers);

// ✅ Sections du professeur connecté
router.get("/teacher", authorize("professeur"), ctrl.getTeacherSections);

router.get("/by-name/:name", async (req, res) => {
  try {
    const section = await Section.findOne({ name: req.params.name })
      .populate("teacherId", "nom prenom");
    if (!section)
      return res.status(404).json({ success: false, message: "Section non trouvée." });
    res.json({ success: true, data: section });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// CRUD — réservé secretaire/admin
router.get("/",       authorize("secretaire", "admin"), ctrl.getSections);
router.post("/",      authorize("secretaire", "admin"), ctrl.createSection);
router.put("/:id",    authorize("secretaire", "admin"), ctrl.updateSection);
router.delete("/:id", authorize("secretaire", "admin"), ctrl.deleteSection);

module.exports = router;