// models/Section.js
const mongoose = require("mongoose");

const SectionSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, unique: true, trim: true },
    language: { type: String, default: "English" },
    level:    { type: String, default: "A1" },
    capacity: { type: Number, default: 12, min: 1 },

    // ── Groupe d'âge (NOUVEAU) ──────────────────────
    ageGroup: {
      type: String,
      enum: ["enfants", "majeurs", "tous"],
      default: "tous",
    },

    // ── Enseignant ───────────────────────────────────
    teacherId:   { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    teacherName: { type: String, default: "" },
    teacher:     { type: String, default: "" }, // rétrocompatibilité

    // ── Horaire & salle ──────────────────────────────
    time: { type: String, default: "" },
    room: { type: String, default: "" },

    // ── Compteur étudiant (source de vérité) ─────────
    studentsCount: { type: Number, default: 0, min: 0 },

    // ── Liste des étudiants inscrits ─────────────────
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    actif: { type: Boolean, default: true },
    flag:  { type: String, default: "📚" },
  },
  {
    timestamps: true,
    toJSON:  { virtuals: true },
    toObject:{ virtuals: true },
  }
);

// ── Virtual : places disponibles ────────────────────
SectionSchema.virtual("placesDisponibles").get(function () {
  return Math.max(0, this.capacity - this.studentsCount);
});

SectionSchema.virtual("estComplete").get(function () {
  return this.studentsCount >= this.capacity;
});

// ── Index ────────────────────────────────────────────
SectionSchema.index({ language: 1, level: 1 });
SectionSchema.index({ ageGroup: 1 });
SectionSchema.index({ room: 1 });

module.exports = mongoose.model("Section", SectionSchema);