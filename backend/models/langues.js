const mongoose = require('mongoose');
const LanguageSchema = new mongoose.Schema({
  nom: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true },
  actif: { type: Boolean, default: true }
}, { timestamps: true });
module.exports = mongoose.model('Language', LanguageSchema);