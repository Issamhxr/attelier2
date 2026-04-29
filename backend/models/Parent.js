const mongoose = require('mongoose');

const ParentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  children: [{
    student:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    relation: { type: String, enum: ['Père','Mère','Tuteur','Tutrice','Autre'], default: 'Autre' },
  }],
  profession: { type: String, default: '' },
  notes:      { type: String, default: '' },
}, { timestamps: true });

ParentSchema.index({ user: 1 });
module.exports = mongoose.model('Parent', ParentSchema);