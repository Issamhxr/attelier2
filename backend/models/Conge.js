const mongoose = require('mongoose');

const CongeSchema = new mongoose.Schema({
  professeur: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type:       { type: String, enum: ['Full Day', 'Half Day'], default: 'Full Day' },
  date:       { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Conge', CongeSchema);