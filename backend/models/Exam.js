const mongoose = require('mongoose');

const ExamSchema = new mongoose.Schema({
  subject:   { type: String, required: true },
  date:      { type: Date, required: true },
  room:      { type: String, default: '' },
  type:      { type: String, default: 'Évaluation finale' },
  section:   { type: String, default: '' },
  level:     { type: String, default: '' },
  time:      { type: String, default: '' },
  duration:  { type: String, default: '90' },
  maxScore:  { type: String, default: '20' },
  description: { type: String, default: '' },
  cours:     { type: mongoose.Schema.Types.ObjectId, ref: 'Cours', default: null },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // ← AJOUT
}, { timestamps: true });

module.exports = mongoose.model('Exam', ExamSchema);