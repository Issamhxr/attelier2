// models/Payment.js
const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  invoiceId:   { type: String, unique: true, sparse: true },
  student:     { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  studentName: { type: String, default: "" },
  language:    { type: String, default: "" },
  level:       { type: String, default: "" },
  section:     { type: String, default: "" },
  amount:      { type: Number, required: true, min: 0 },
  paid:        { type: Number, default: 0, min: 0 },
  due:         { type: Date, required: true },
  method:      { type: String, default: "Espèces" },
  status: {
    type:    String,
    enum:    ["paid", "partial", "pending", "overdue"],
    default: "pending",
  },
}, { timestamps: true });

// ── SINGLE pre('save') hook — calcul statut + invoiceId ──
paymentSchema.pre("save", async function (next) {
  try {
    // 1. Générer invoiceId si absent
    if (!this.invoiceId) {
      const count = await mongoose.model("Payment").countDocuments();
      const year  = new Date().getFullYear();
      this.invoiceId = `INV-${year}-${String(count + 1).padStart(3, "0")}`;
    }

    // 2. Calculer le statut automatiquement
    if (this.paid >= this.amount)       this.status = "paid";
    else if (this.paid > 0)             this.status = "partial";
    else if (new Date() > this.due)     this.status = "overdue";
    else                                this.status = "pending";

    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("Payment", paymentSchema);