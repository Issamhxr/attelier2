// models/Notification.js
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  type:  {
    type: String,
    enum: ["payment", "absence", "system", "alert"],
    default: "system",
  },
  icon:  { type: String, default: "🔔" },
  title: { type: String, required: true },
  msg:   { type: String, required: true },
  tag:   { type: String, default: "system" },
  read:  { type: Boolean, default: false },

  // Cibles textuelles (ex: "Tous les étudiants", "Niveau B2")
  targets: { type: [String], default: [] },

  // Destinataires explicites (ObjectId users) — pour push ciblé
  recipients: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  // Qui a créé la notif
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },

  // Lectures individuelles (pour multi-user)
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });

notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ read: 1 });

module.exports = mongoose.model("Notification", notificationSchema);