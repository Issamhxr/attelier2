// models/Timetable.js
const mongoose = require("mongoose");

const TimetableSchema = new mongoose.Schema(
  {
    sectionId: { type: mongoose.Schema.Types.ObjectId, ref: "Section", default: null },
    section:   { type: String, default: "" },   // nom en clair (fallback)
    subject:   { type: String, default: "" },   // langue
    teacher:   { type: String, default: "" },
    room:      { type: String, required: true },
    startTime: { type: String, required: true }, // "08h00"
    endTime:   { type: String, required: true }, // "09h30"
    // 0=Dimanche, 1=Lundi, 2=Mardi, 3=Mercredi, 4=Jeudi, 5=Vendredi, 6=Samedi
    dayOfWeek: { type: Number, required: true, min: 0, max: 6 },
    actif:     { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Timetable", TimetableSchema);