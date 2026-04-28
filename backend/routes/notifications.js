// routes/notifications.js
const express      = require("express");
const router       = express.Router();
const ctrl         = require("../controllers/notificationController");
const { protect }  = require("../middleware/auth");

router.get("/",            protect, ctrl.getAll);
router.post("/",           protect, ctrl.create);
router.patch("/:id/read",  protect, ctrl.markRead);
router.patch("/read-all",  protect, ctrl.markAllRead);
router.delete("/:id",      protect, ctrl.deleteOne);
router.delete("/",         protect, ctrl.deleteAll);

module.exports = router;