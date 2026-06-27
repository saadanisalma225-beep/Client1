const jwt = require('jsonwebtoken');

const generateToken = (id, type = 'admin') => {
  const payload = type === 'client' 
    ? { id_client: id } 
    : { id };
  
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

module.exports = generateToken;