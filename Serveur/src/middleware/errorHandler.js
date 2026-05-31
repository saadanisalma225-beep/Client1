const ApiError = require('../utils/ApiError');

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // En développement : détails complets
  if (process.env.NODE_ENV === 'development') {
    return res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message,
      stack: err.stack
    });
  }

  // En production : message simple
  res.status(err.statusCode).json({
    success: false,
    message: err.isOperational ? err.message : 'Erreur serveur'
  });
};