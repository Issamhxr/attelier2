const crypto = require('crypto');
const jwt    = require('jsonwebtoken');
const User   = require('../models/User');
const { sendEmail, sendPasswordResetEmail } = require('../services/emailService');

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

const sendTokenResponse = async (user, statusCode, res, message = 'Succès.') => {
  const accessToken  = user.getSignedJwtToken();
  const refreshToken = user.getRefreshToken();

  user.refreshToken       = hashToken(refreshToken);
  user.refreshTokenExpire = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
  user.lastLogin          = new Date();
  await user.save({ validateBeforeSave: false });

  return res.status(statusCode).json({
    success: true, message, accessToken, refreshToken,
    user: { id: user._id, nom: user.nom, prenom: user.prenom, email: user.email, role: user.role, actif: user.actif, avatar: user.avatar },
  });
};

exports.register = async (req, res, next) => {
  try {
    const { nom, prenom, email, password, telephone, language, level, section } = req.body;
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ success: false, message: 'Cet email est déjà utilisé.' });

    const user = await User.create({
      nom: nom || '', prenom: prenom || '', email: email.toLowerCase(), password, role: 'etudiant',
      telephone: telephone || '', language: language || '', level: level || '',
      section: section || 'À assigner', actif: false,
    });
    return sendTokenResponse(user, 201, res, 'Compte créé. En attente de validation.');
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email et mot de passe requis.' });

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) return res.status(401).json({ success: false, message: 'Identifiants invalides.' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Identifiants invalides.' });

    if (!user.actif) return res.status(403).json({ success: false, message: 'Compte désactivé ou en attente de validation.' });

    return sendTokenResponse(user, 200, res, 'Connexion réussie.');
  } catch (err) { next(err); }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ success: false, message: 'Refresh token requis.' });

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET + '_refresh');
    } catch {
      return res.status(401).json({ success: false, message: 'Refresh token invalide ou expiré.', code: 'REFRESH_TOKEN_INVALID' });
    }

    const hashed = hashToken(refreshToken);
    const user = await User.findOne({ _id: decoded.id, refreshToken: hashed, refreshTokenExpire: { $gt: new Date() } });
    if (!user) return res.status(401).json({ success: false, message: 'Session expirée. Reconnectez-vous.', code: 'REFRESH_TOKEN_EXPIRED' });
    if (!user.actif) return res.status(403).json({ success: false, message: 'Compte désactivé.' });

    return sendTokenResponse(user, 200, res, 'Token renouvelé.');
  } catch (err) { next(err); }
};

exports.logout = async (req, res, next) => {
  try {
    if (req.user) await User.findByIdAndUpdate(req.user.id, { refreshToken: null, refreshTokenExpire: null });
    return res.json({ success: true, message: 'Déconnexion réussie.' });
  } catch (err) { next(err); }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    return res.json({ success: true, user });
  } catch (err) { next(err); }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { nom, prenom, telephone, adresse } = req.body;
    const updates = {};
    if (nom)       updates.nom       = nom.trim();
    if (prenom)    updates.prenom    = prenom.trim();
    if (telephone) updates.telephone = telephone.trim();
    if (adresse)   updates.adresse   = adresse.trim();
    if (req.file)  updates.avatar    = `/uploads/images/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true });
    return res.json({ success: true, message: 'Profil mis à jour.', user });
  } catch (err) { next(err); }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { currentPwd, newPwd } = req.body;
    const user = await User.findById(req.user.id).select('+password');
    const isMatch = await user.matchPassword(currentPwd);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Mot de passe actuel incorrect.' });
    user.password = newPwd;
    user.refreshToken = null;
    user.refreshTokenExpire = null;
    await user.save();
    return res.json({ success: true, message: 'Mot de passe modifié.' });
  } catch (err) { next(err); }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    const successMsg = 'Si cet email existe, un lien de réinitialisation a été envoyé.';
    if (!user) return res.json({ success: true, message: successMsg });

    const rawToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${rawToken}`;
    try {
      await sendPasswordResetEmail({ to: user.email, name: user.prenom || user.nom || 'Utilisateur', resetUrl });
    } catch (emailErr) {
      user.resetPasswordToken = null;
      user.resetPasswordExpire = null;
      await user.save({ validateBeforeSave: false });
      return res.status(500).json({ success: false, message: 'Erreur envoi email.' });
    }
    return res.json({ success: true, message: successMsg, ...(process.env.NODE_ENV === 'development' && { resetUrl }) });
  } catch (err) { next(err); }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    const hashed = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({ resetPasswordToken: hashed, resetPasswordExpire: { $gt: Date.now() } }).select('+resetPasswordToken +resetPasswordExpire');
    if (!user) return res.status(400).json({ success: false, message: 'Token invalide ou expiré.' });
    user.password = password;
    user.resetPasswordToken  = null;
    user.resetPasswordExpire = null;
    user.refreshToken        = null;
    user.refreshTokenExpire  = null;
    await user.save();
    return sendTokenResponse(user, 200, res, 'Mot de passe réinitialisé.');
  } catch (err) { next(err); }
};

exports.verifyEmail = async (req, res, next) => {
  try {
    const hashed = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({ emailVerificationToken: hashed }).select('+emailVerificationToken');
    if (!user) return res.status(400).json({ success: false, message: 'Token de vérification invalide.' });
    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    await user.save({ validateBeforeSave: false });
    return res.json({ success: true, message: 'Email vérifié.' });
  } catch (err) { next(err); }
};