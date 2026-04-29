const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sender:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject:   { type: String, required: true },
  body:      { type: String, required: true },
  tag:       { type: String, enum: ['sys','abs','ins','pay'], default: 'sys' },
  read:      { type: Boolean, default: false },
  starred:   { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Message', MessageSchema);