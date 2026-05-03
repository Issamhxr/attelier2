const mongoose = require('mongoose');

const AnnouncementSchema = new mongoose.Schema({
  tag:     { type: String, default: 'Système' },
  tagClass:{ type: String, default: 'db-tag-blue' },
  text:    { type: String, required: true },
  section: { type: String, default: '' }, // vide = visible par tous
}, { timestamps: true });

module.exports = mongoose.model('Announcement', AnnouncementSchema);