// routes/secretaire.js
const express  = require("express");
const router   = express.Router();
const ctrl     = require("../controllers/secretaireController");
const { protect, authorize } = require("../middleware/auth");

router.use(protect);

/* ── DASHBOARD ─────────────────────────────────── */
router.get("/stats", ctrl.getDashboardStats);

/* ── INSCRIPTIONS ─────────────────────────────── */
router.get("/students",              ctrl.getStudents);
router.get("/students/pending",      ctrl.getPendingStudents);
router.post("/students/register",    ctrl.registerStudent);
router.patch("/students/:id/accept", ctrl.acceptStudent);
router.delete("/students/:id/reject",ctrl.rejectStudent);

/* ── SECTIONS ─────────────────────────────────── */
router.get("/sections",        ctrl.getSections);
router.post("/sections",       ctrl.createSection);
router.put("/sections/:id",    ctrl.updateSection);
router.delete("/sections/:id", ctrl.deleteSection);

/* ── EMPLOI DU TEMPS ──────────────────────────── */
router.get("/timetable",        ctrl.getTimetable);
router.post("/timetable",       ctrl.createTimetableEntry);
router.delete("/timetable/:id", ctrl.deleteTimetableEntry);

/* ── ABSENCES ─────────────────────────────────── */
router.get("/absences",               ctrl.getAbsences);
router.post("/absences",              ctrl.createAbsence);
router.patch("/absences/:id/justify", ctrl.toggleAbsenceJustified);
router.delete("/absences/:id",        ctrl.deleteAbsence);

/* ── PAIEMENTS ────────────────────────────────── */
router.get("/payments",           ctrl.getPayments);
router.post("/payments",          ctrl.createPayment);
router.patch("/payments/:id/pay", ctrl.markPaymentPaid);
router.delete("/payments/:id",    ctrl.deletePayment);

/* ── NOTIFICATIONS ────────────────────────────── */
// ⚠️ read-all AVANT /:id pour éviter le conflit
router.get("/notifications",                  ctrl.getNotifications);
router.patch("/notifications/read-all",       ctrl.markAllNotificationsRead);
router.patch("/notifications/:id/read",       ctrl.markNotificationRead);
router.delete("/notifications/:id",           ctrl.deleteNotification);

/* ── MESSAGES ─────────────────────────────────── */
router.get("/messages",              ctrl.getMessages);
router.post("/messages",             ctrl.sendMessage);
router.post("/messages/:id/reply",   ctrl.replyToMessage);
router.patch("/messages/:id/read",   ctrl.markMessageRead);
router.patch("/messages/:id/star",   ctrl.toggleMessageStar);
router.delete("/messages/:id",       ctrl.deleteMessage);

/* ── SETTINGS ─────────────────────────────────── */
router.get("/profile",          ctrl.getProfile);
router.put("/profile",          ctrl.updateProfile);
router.patch("/change-password",ctrl.changePassword);
router.get("/settings",         ctrl.getSchoolSettings);
router.put("/settings",         ctrl.updateSchoolSettings);

module.exports = router;