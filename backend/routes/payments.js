// routes/payments.js
const express     = require("express");
const router      = express.Router();
const ctrl        = require("../controllers/paymentController");
const { protect } = require("../middleware/auth");

router.get("/stats",      protect, ctrl.getStats);
router.get("/",           protect, ctrl.getPayments);
router.post("/",          protect, ctrl.createPayment);
router.patch("/:id/pay",  protect, ctrl.registerPayment);
router.delete("/:id",     protect, ctrl.deletePayment);

module.exports = router;