const EmploiDuTemps = require('../models/Timetable');
// APRÈS
exports.getEmplois = async (req, res) => {
  try {
    const { jour, day } = req.query;
    let filter = { actif: true };

    // Accepter soit un nom français soit un numéro de jour
    const FR_TO_NUM = {
      'Dimanche':0,'Lundi':1,'Mardi':2,
      'Mercredi':3,'Jeudi':4,'Vendredi':5,'Samedi':6
    };
    if (jour && FR_TO_NUM[jour] !== undefined) {
      filter.dayOfWeek = FR_TO_NUM[jour];
    } else if (day !== undefined) {
      filter.dayOfWeek = parseInt(day);
    }

    const emplois = await EmploiDuTemps.find(filter)
      .populate('sectionId', 'nom')
      .sort({ dayOfWeek: 1, startTime: 1 });

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
