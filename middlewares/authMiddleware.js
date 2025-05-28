// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Middleware de autenticação JWT
 * Verifica se o token está presente e válido.
 * Injeta o ID do usuário autenticado em req.user
 */
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Verifica se o header está presente e no formato correto
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ mensagem: 'Token não fornecido' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verifica e decodifica o token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id; // Torna o ID do usuário disponível em req.user
    next(); // Continua para a rota protegida
  } catch (err) {
    return res.status(401).json({ mensagem: 'Token inválido ou expirado' });
  }
};

module.exports = authMiddleware;