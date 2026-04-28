const mongoose = require('mongoose');

const EtudiantSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  matricule: { type: String, unique: true },
  dateNaissance: { type: Date },
  niveauActuel: { type: String, enum: ['Débutant', 'Élémentaire', 'Intermédiaire', 'Avancé', 'Expert'] },
  coursInscrits: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Cours' }],
  notes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Note' }],
  paiements: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Paiement' }]
}, { timestamps: true });

// Générer un matricule automatique
EtudiantSchema.pre('save', async function (next) {
  if (!this.matricule) {
    const count = await mongoose.model('Etudiant').countDocuments();
    this.matricule = `ETU-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Etudiant', EtudiantSchema);
