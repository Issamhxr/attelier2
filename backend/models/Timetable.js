const mongoose = require('mongoose');

const TimetableSchema = new mongoose.Schema({
  sectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Section', default: null },
  section:   { type: String, default: '' },
  subject:   { type: String, default: '' },
  teacher:   { type: String, default: '' },
  room:      { type: String, required: true },
  startTime: { type: String, required: true },
  endTime:   { type: String, required: true },
  dayOfWeek: { type: Number, required: true, min: 0, max: 6 },
  actif:     { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Timetable', TimetableSchema);