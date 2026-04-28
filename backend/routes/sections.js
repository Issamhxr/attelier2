// routes/sections.js
const express = require("express");
const router  = express.Router();
const ctrl    = require("../controllers/sectionController");
const { protect, authorize } = require("../middleware/auth");

router.use(protect);
router.use(authorize("secretaire", "admin"));

// ⚠️ Routes statiques AVANT les routes avec paramètre /:id
router.get("/available-rooms", ctrl.getAvailableRooms);
router.get("/available-slots", ctrl.getAvailableSlots);
router.get("/teachers",        ctrl.getTeachers);

// CRUD
router.get("/",    ctrl.getSections);
router.post("/",   ctrl.createSection);
router.put("/:id", ctrl.updateSection);
router.delete("/:id", ctrl.deleteSection);

module.exports = router;