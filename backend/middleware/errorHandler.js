const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message    = err.message    || 'Erreur interne du serveur.';

  if (process.env.NODE_ENV !== 'production') {
    console.error('❌ Erreur :', { message: err.message, url: req.originalUrl, method: req.method });
  }

  if (err.name === 'CastError') {
    statusCode = 404;
    message    = `Ressource introuvable avec l'identifiant : ${err.value}`;
  }
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'champ';
    const value = Object.values(err.keyValue || {})[0] || '';
    message = `La valeur "${value}" existe déjà pour le champ "${field}".`;
  }
  if (err.name === 'ValidationError') {
    statusCode = 422;
    message    = Object.values(err.errors).map(e => e.message).join(' | ');
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message    = 'Token expiré. Veuillez vous reconnecter.';
  }
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message    = 'Token invalide.';
  }
  if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 413;
    message    = 'Fichier trop volumineux.';
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

module.exports = errorHandler;