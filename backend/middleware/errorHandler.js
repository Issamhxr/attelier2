/* ══════════════════════════════════════════
   GLOBAL ERROR HANDLER
══════════════════════════════════════════ */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message    = err.message    || 'Erreur interne du serveur.';

  // Log en développement
  if (process.env.NODE_ENV !== 'production') {
    console.error('❌ Erreur :', {
      message: err.message,
      stack:   err.stack,
      url:     req.originalUrl,
      method:  req.method,
    });
  } else {
    // En production on log seulement les 5xx
    if (statusCode >= 500) console.error('❌ Erreur serveur :', err.message);
  }

  // ── Mongoose : ID invalide ──────────────
  if (err.name === 'CastError') {
    statusCode = 404;
    message    = `Ressource introuvable avec l'identifiant : ${err.value}`;
  }

  // ── Mongoose : champ unique dupliqué ────
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'champ';
    const value = Object.values(err.keyValue || {})[0] || '';
    message = `La valeur "${value}" existe déjà pour le champ "${field}".`;
  }

  // ── Mongoose : validation ───────────────
  if (err.name === 'ValidationError') {
    statusCode = 422;
    message    = Object.values(err.errors)
      .map(e => e.message)
      .join(' | ');
  }

  // ── JWT expiré ──────────────────────────
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message    = 'Token expiré. Veuillez vous reconnecter.';
  }

  // ── JWT invalide ────────────────────────
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message    = 'Token invalide.';
  }

  // ── Multer : fichier trop lourd ─────────
  if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 413;
    message    = `Fichier trop volumineux. Taille maximale : ${Math.round(process.env.MAX_FILE_SIZE / 1024 / 1024)}MB`;
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

module.exports = errorHandler;