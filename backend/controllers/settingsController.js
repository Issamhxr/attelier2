const Settings = require("../models/Settings");

// ── GET /api/settings ──────────────────────────────
exports.getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create({});
    return res.json({ success: true, settings });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ── PUT /api/settings ──────────────────────────────
exports.updateSettings = async (req, res) => {
  try {
    const { schoolName, city, address, email, phone, maxStudents } = req.body;
    const updates = {};
    if (schoolName)  updates.schoolName  = schoolName;
    if (city)        updates.city        = city;
    if (address)     updates.address     = address;
    if (email)       updates.email       = email;
    if (phone)       updates.phone       = phone;
    if (maxStudents) updates.maxStudents = maxStudents;

    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create(updates);
    } else {
      settings = await Settings.findByIdAndUpdate(settings._id, updates, { new: true });
    }

    return res.json({ success: true, message: "Paramètres sauvegardés.", settings });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};