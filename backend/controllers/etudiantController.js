const Etudiant = require('../models/Etudiant');
const User = require('../models/User');

// GET tous les étudiants
exports.getEtudiants = async (req, res) => {
  try {
    const etudiants = await Etudiant.find()
      .populate('user', 'nom prenom email telephone actif')
      .populate('coursInscrits', 'nom langue niveau');
    res.json({ success: true, count: etudiants.length, data: etudiants });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET un étudiant
exports.getEtudiant = async (req, res) => {
  try {
    const etudiant = await Etudiant.findById(req.params.id)
      .populate('user', 'nom prenom email telephone adresse')
      .populate('coursInscrits', 'nom langue niveau prix')
      .populate('notes')
      .populate('paiements');
    if (!etudiant) return res.status(404).json({ message: 'Étudiant non trouvé.' });
    res.json({ success: true, data: etudiant });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT modifier un étudiant
exports.updateEtudiant = async (req, res) => {
  try {
    const { nom, prenom, telephone, adresse, dateNaissance, niveauActuel } = req.body;
    const etudiant = await Etudiant.findById(req.params.id);
    if (!etudiant) return res.status(404).json({ message: 'Étudiant non trouvé.' });

    // Mettre à jour le User lié
    await User.findByIdAndUpdate(etudiant.user, { nom, prenom, telephone, adresse });
    if (dateNaissance) etudiant.dateNaissance = dateNaissance;
    if (niveauActuel) etudiant.niveauActuel = niveauActuel;
    await etudiant.save();

    res.json({ success: true, message: 'Étudiant mis à jour.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE supprimer un étudiant
exports.deleteEtudiant = async (req, res) => {
  try {
    const etudiant = await Etudiant.findById(req.params.id);
    if (!etudiant) return res.status(404).json({ message: 'Étudiant non trouvé.' });

    await User.findByIdAndUpdate(etudiant.user, { actif: false });
    res.json({ success: true, message: 'Étudiant désactivé.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
