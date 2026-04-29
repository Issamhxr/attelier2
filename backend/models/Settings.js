const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  schoolName:  { type: String, default: 'Language School' },
  city:        { type: String, default: '' },
  address:     { type: String, default: '' },
  email:       { type: String, default: '' },
  phone:       { type: String, default: '' },
  maxStudents: { type: Number, default: 1000 },
  logo:        { type: String, default: '' },
  description: { type: String, default: '' },
  languages:   { type: [String], default: ['English','French','Spanish','Arabic','German'] },
  levels:      { type: [String], default: ['A1','A2','B1','B2','C1','C2'] },
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);