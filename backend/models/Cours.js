const mongoose = require('mongoose');

const CoursSchema = new mongoose.Schema({
  nom: { type: String, required: [true, 'Le nom du cours est requis'] },
  langue: { type: String, required: true, enum: ['Anglais', 'Français', 'Arabe', 'Espagnol', 'Allemand', 'Italien', 'Autre'] },
  niveau: { type: String, required: true, enum: ['Débutant', 'Élémentaire', 'Intermédiaire', 'Avancé', 'Expert'] },
  description: { type: String },
  duree: { type: Number, required: true, comment: 'Durée en heures' },
  prix: { type: Number, required: true },
  capaciteMax: { type: Number, default: 20 },
  professeur: { type: mongoose.Schema.Types.ObjectId, ref: 'Professeur' },
  etudiants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Etudiant' }],
  actif: { type: Boolean, default: true }
}, { timestamps: true });

// Nombre d'étudiants inscrits
CoursSchema.virtual('nbEtudiants').get(function () {
  return this.etudiants.length;
});

module.exports = mongoose.model('Cours', CoursSchema);
