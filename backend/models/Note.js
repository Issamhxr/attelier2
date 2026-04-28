// models/Note.js
const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  etudiant:       { type: mongoose.Schema.Types.ObjectId, ref: 'Etudiant', required: true },
  cours:          { type: mongoose.Schema.Types.ObjectId, ref: 'Cours', required: true },
  professeur:     { type: mongoose.Schema.Types.ObjectId, ref: 'Professeur' },
  typeEvaluation: {
    type: String,
    enum: ['Devoir', 'Examen Partiel', 'Examen Final', 'Quiz', 'Oral'],
    required: true,
  },
  note:           { type: Number, min: 0, max: 20, required: true },
  noteMax:        { type: Number, default: 20 },
  commentaire:    { type: String },
  dateEvaluation: { type: Date, default: Date.now },
}, { timestamps: true });

NoteSchema.virtual('mention').get(function () {
  if (this.note >= 18) return 'Excellent';
  if (this.note >= 16) return 'Très Bien';
  if (this.note >= 14) return 'Bien';
  if (this.note >= 10) return 'Passable';
  return 'Insuffisant';
});

module.exports = mongoose.model('Note', NoteSchema);