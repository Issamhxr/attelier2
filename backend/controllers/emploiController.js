const EmploiDuTemps = require('../models/Timetable');

exports.getEmplois = async (req, res) => {
  try {
    const { jour, coursId, professeurId } = req.query;
    let filter = { actif: true };
    if (jour) filter.jourSemaine = jour;
    if (coursId) filter.cours = coursId;
    if (professeurId) filter.professeur = professeurId;

    const emplois = await EmploiDuTemps.find(filter)
      .populate('cours', 'nom langue niveau')
      .populate({ path: 'professeur', populate: { path: 'user', select: 'nom prenom' } })
      .sort({ jourSemaine: 1, heureDebut: 1 });
    res.json({ success: true, count: emplois.length, data: emplois });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createEmploi = async (req, res) => {
  try {
    // Vérifier les conflits de salle
    const conflit = await EmploiDuTemps.findOne({
      salle: req.body.salle,
      jourSemaine: req.body.jourSemaine,
      actif: true,
      $or: [
        { heureDebut: { $lt: req.body.heureFin, $gte: req.body.heureDebut } },
        { heureFin: { $gt: req.body.heureDebut, $lte: req.body.heureFin } }
      ]
    });
    if (conflit) return res.status(400).json({ message: `Conflit : la salle ${req.body.salle} est déjà occupée à cet horaire.` });

    const emploi = await EmploiDuTemps.create(req.body);
    res.status(201).json({ success: true, data: emploi });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateEmploi = async (req, res) => {
  try {
    const emploi = await EmploiDuTemps.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!emploi) return res.status(404).json({ message: 'Créneau non trouvé.' });
    res.json({ success: true, data: emploi });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteEmploi = async (req, res) => {
  try {
    await EmploiDuTemps.findByIdAndUpdate(req.params.id, { actif: false });
    res.json({ success: true, message: 'Créneau supprimé.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
