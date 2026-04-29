const mongoose = require('mongoose');

const absenceSchema = new mongoose.Schema({
  student:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  language:  { type: String, default: '' },
  level:     { type: String, default: '' },
  date:      { type: Date, required: true },
  session:   { type: String, default: 'Morning' },
  reason:    { type: String, enum: ['Sick','Personal','Travel','Unknown'], default: 'Unknown' },
  justified: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Absence', absenceSchema);