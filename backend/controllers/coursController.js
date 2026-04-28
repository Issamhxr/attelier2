const Cours = require('../models/Cours');
const Etudiant = require('../models/Etudiant');

exports.getCours = async (req, res) => {
  try {
    const { langue, niveau, actif } = req.query;
    let filter = {};
    if (langue) filter.langue = langue;
    if (niveau) filter.niveau = niveau;
    if (actif !== undefined) filter.actif = actif === 'true';

    const cours = await Cours.find(filter)
      .populate('professeur', 'user specialites')
      .populate({ path: 'professeur', populate: { path: 'user', select: 'nom prenom' } });
    res.json({ success: true, count: cours.length, data: cours });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCour = async (req, res) => {
  try {
    const cours = await Cours.findById(req.params.id)
      .populate({ path: 'professeur', populate: { path: 'user', select: 'nom prenom email' } })
      .populate({ path: 'etudiants', populate: { path: 'user', select: 'nom prenom' } });
    if (!cours) return res.status(404).json({ message: 'Cours non trouvé.' });
    res.json({ success: true, data: cours });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createCours = async (req, res) => {
  try {
    const cours = await Cours.create(req.body);
    res.status(201).json({ success: true, data: cours });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCours = async (req, res) => {
  try {
    const cours = await Cours.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!cours) return res.status(404).json({ message: 'Cours non trouvé.' });
    res.json({ success: true, data: cours });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCours = async (req, res) => {
  try {
    const cours = await Cours.findByIdAndUpdate(req.params.id, { actif: false }, { new: true });
    if (!cours) return res.status(404).json({ message: 'Cours non trouvé.' });
    res.json({ success: true, message: 'Cours désactivé.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Inscrire un étudiant à un cours
exports.inscrireEtudiant = async (req, res) => {
  try {
    const cours = await Cours.findById(req.params.id);
    if (!cours) return res.status(404).json({ message: 'Cours non trouvé.' });

    const etudiant = await Etudiant.findById(req.params.etudiantId);
    if (!etudiant) return res.status(404).json({ message: 'Étudiant non trouvé.' });

    if (cours.etudiants.includes(etudiant._id)) {
      return res.status(400).json({ message: 'Étudiant déjà inscrit dans ce cours.' });
    }
    if (cours.etudiants.length >= cours.capaciteMax) {
      return res.status(400).json({ message: 'Capacité maximale atteinte.' });
    }

    cours.etudiants.push(etudiant._id);
    await cours.save();
    etudiant.coursInscrits.push(cours._id);
    await etudiant.save();

    res.json({ success: true, message: 'Étudiant inscrit avec succès.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
