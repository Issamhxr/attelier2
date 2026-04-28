// routes/teacher.js
const express = require("express");
const router  = express.Router();
const { protect, authorize } = require("../middleware/auth");
const {
  getDashboard,
  getProfile,
  updateProfile,
  getTimetable,
  getMyStudents,
  getMyCourses,
  getAttendanceSummary,
} = require("../controllers/teacherController");

// Toutes les routes → authentifié + rôle professeur
router.use(protect);
router.use(authorize("professeur", "admin"));

router.get("/dashboard",   getDashboard);        // GET  /api/teacher/dashboard
router.get("/profile",     getProfile);          // GET  /api/teacher/profile
router.put("/profile",     updateProfile);       // PUT  /api/teacher/profile
router.get("/timetable",   getTimetable);        // GET  /api/teacher/timetable
router.get("/students",    getMyStudents);       // GET  /api/teacher/students
router.get("/courses",     getMyCourses);        // GET  /api/teacher/courses
router.get("/attendance",  getAttendanceSummary);// GET  /api/teacher/attendance

module.exports = router;