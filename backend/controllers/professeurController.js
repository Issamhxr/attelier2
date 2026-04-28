const Professeur = require('../models/Professeur');
const User = require('../models/User');

exports.getProfesseurs = async (req, res) => {
  try {
    const professeurs = await Professeur.find()
      .populate('user', 'nom prenom email telephone actif')
      .populate('cours', 'nom langue niveau');
    res.json({ success: true, count: professeurs.length, data: professeurs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProfesseur = async (req, res) => {
  try {
    const professeur = await Professeur.findById(req.params.id)
      .populate('user', 'nom prenom email telephone adresse')
      .populate('cours', 'nom langue niveau prix');
    if (!professeur) return res.status(404).json({ message: 'Professeur non trouvé.' });
    res.json({ success: true, data: professeur });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfesseur = async (req, res) => {
  try {
    const { nom, prenom, telephone, specialites, diplomes, anneesExperience, salaire, bio } = req.body;
    const professeur = await Professeur.findById(req.params.id);
    if (!professeur) return res.status(404).json({ message: 'Professeur non trouvé.' });

    await User.findByIdAndUpdate(professeur.user, { nom, prenom, telephone });
    Object.assign(professeur, { specialites, diplomes, anneesExperience, salaire, bio });
    await professeur.save();

    res.json({ success: true, message: 'Professeur mis à jour.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
