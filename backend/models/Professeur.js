const mongoose = require('mongoose');

const ProfesseurSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  specialites: [{ type: String }],
  diplomes: [{ type: String }],
  anneesExperience: { type: Number, default: 0 },
  cours: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Cours' }],
  salaire: { type: Number },
  bio: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Professeur', ProfesseurSchema);
