const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
  user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text:     { type: String, required: true },
  done:     { type: Boolean, default: false },
  priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
}, { timestamps: true });

module.exports = mongoose.model('Todo', TodoSchema);