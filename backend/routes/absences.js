// routes/absences.js
const express     = require("express");
const router      = express.Router();
const ctrl        = require("../controllers/absenceController");
const { protect } = require("../middleware/auth");

// ⚠️ /stats avant /:id pour éviter le conflit de route
router.get("/stats",          protect, ctrl.getStats);
router.get("/",               protect, ctrl.getAbsences);
router.post("/",              protect, ctrl.createAbsence);
router.patch("/:id/justify",  protect, ctrl.toggleJustified);
router.delete("/:id",         protect, ctrl.deleteAbsence);

module.exports = router;