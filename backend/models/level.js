const mongoose = require('mongoose');
const LevelSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  code: { type: String, required: true },
  description: { type: String },
  language: { type: mongoose.Schema.Types.ObjectId, ref: 'Language', required: true }
}, { timestamps: true });
module.exports = mongoose.model('Level', LevelSchema);