const express     = require("express");
const router      = express.Router();
const ctrl        = require("../controllers/settingsController");
const { protect } = require("../middleware/auth");

router.get("/",  protect, ctrl.getSettings);
router.put("/",  protect, ctrl.updateSettings);

module.exports = router;