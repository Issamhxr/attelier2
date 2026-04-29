const mongoose = require('mongoose');

const RegistrationSchema = new mongoose.Schema({
  student:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  section:  { type: mongoose.Schema.Types.ObjectId, ref: 'Section', default: null },
  language: { type: String, default: '' },
  level:    { type: String, default: '' },
  statut: {
    type: String,
    enum: ['pending','active','rejected','completed','cancelled'],
    default: 'pending',
  },
  payment:     { type: mongoose.Schema.Types.ObjectId, ref: 'Payment', default: null },
  validatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  validatedAt:     { type: Date, default: null },
  rejectedAt:      { type: Date, default: null },
  rejectionReason: { type: String, default: '' },
  notes:           { type: String, default: '' },
  dateInscription: { type: Date, default: Date.now },
}, { timestamps: true });

RegistrationSchema.index({ student: 1 });
RegistrationSchema.index({ statut: 1 });

module.exports = mongoose.model('Registration', RegistrationSchema);