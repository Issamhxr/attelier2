const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const crypto   = require('crypto');

const UserSchema = new mongoose.Schema({
  nom:    { type: String, trim: true, default: '' },
  prenom: { type: String, trim: true, default: '' },
  email:  {
    type: String, required: [true, 'Email requis.'],
    unique: true, lowercase: true, trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Email invalide.'],
  },
  password: {
    type: String, required: [true, 'Mot de passe requis.'],
    minlength: [6, 'Mot de passe trop court (6 min).'], select: false,
  },
  role: {
    type: String,
    enum: ['admin','professeur','etudiant','parent','secretaire'],
    default: 'etudiant',
  },
  telephone: { type: String, trim: true, default: '' },
  adresse:   { type: String, default: '' },
  actif:     { type: Boolean, default: true },
  avatar:    { type: String, default: '' },
  dateInscription: { type: Date, default: Date.now },

  // Étudiant
  language: { type: String, default: '' },
  level:    { type: String, default: '' },
  schedule: { type: String, default: '' },
  section:  { type: String, default: 'À assigner' },
  absences: { type: Number, default: 0, min: 0 },
  notes:    { type: String, default: '' },

  // Enseignant
  specialty:   { type: String, default: '' },
  hours:       { type: Number, default: 0, min: 0 },
  classes:     { type: [String], default: [] },

  // Secrétaire
  department:  { type: String, default: '' },
  permissions: { type: [String], default: [] },

  // Parent
  linkedStudent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  relation:      { type: String, default: '' },

  archivedAt: { type: Date, default: null },

  // Tokens
  refreshToken:       { type: String, select: false, default: null },
  refreshTokenExpire: { type: Date,   default: null },
  resetPasswordToken:  { type: String, select: false, default: null },
  resetPasswordExpire: { type: Date,   select: false, default: null },
  isEmailVerified:       { type: Boolean, default: false },
  emailVerificationToken:{ type: String,  select: false, default: null },
  lastLogin: { type: Date, default: null },
}, {
  timestamps: true,
  toJSON:  { virtuals: true },
  toObject:{ virtuals: true },
});

UserSchema.virtual('fullName').get(function () {
  return `${this.prenom || ''} ${this.nom || ''}`.trim();
});

UserSchema.index({ role: 1, actif: 1 });
UserSchema.index({ email: 1 });
UserSchema.index({ section: 1 });

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
};

UserSchema.methods.getRefreshToken = function () {
  const token = jwt.sign(
    { id: this._id },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET + '_refresh',
    { expiresIn: process.env.JWT_REFRESH_EXPIRE || '90d' }
  );
  this.refreshToken       = token;
  this.refreshTokenExpire = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
  return token;
};

UserSchema.methods.getResetPasswordToken = function () {
  const raw = crypto.randomBytes(32).toString('hex');
  this.resetPasswordToken  = crypto.createHash('sha256').update(raw).digest('hex');
  this.resetPasswordExpire = Date.now() + (parseInt(process.env.RESET_TOKEN_EXPIRE) || 3600000);
  return raw;
};

UserSchema.methods.getEmailVerificationToken = function () {
  const raw = crypto.randomBytes(32).toString('hex');
  this.emailVerificationToken = crypto.createHash('sha256').update(raw).digest('hex');
  return raw;
};

module.exports = mongoose.model('User', UserSchema);