// routes/absences.js
const express = require("express");
const router  = express.Router();
const ctrl    = require("../controllers/absenceController");
const auth    = require("../middleware/auth");

router.get("/stats",      auth, ctrl.getStats);
router.get("/",           auth, ctrl.getAbsences);
router.post("/",          auth, ctrl.createAbsence);
router.patch("/:id/justify", auth, ctrl.toggleJustified);
router.delete("/:id",     auth, ctrl.deleteAbsence);

module.exports = router;