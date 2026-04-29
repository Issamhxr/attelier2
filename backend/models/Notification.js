const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  type:  { type: String, enum: ['payment','absence','system','alert'], default: 'system' },
  icon:  { type: String, default: '🔔' },
  title: { type: String, required: true },
  msg:   { type: String, required: true },
  tag:   { type: String, default: 'system' },
  read:  { type: Boolean, default: false },
  targets:    { type: [String], default: [] },
  recipients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdBy:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  readBy:     [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ read: 1 });

module.exports = mongoose.model('Notification', notificationSchema);