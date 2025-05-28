const express = require('express');
const router = express.Router();
const {
  register,
  login,
  forgotPassword,
  resetPassword
} = require('../controllers/authController');

/**
 * @route POST /api/auth/register
 * @desc Registra um novo vendedor
 */
router.post('/register', register);

/**
 * @route POST /api/auth/login
 * @desc Autentica o vendedor e retorna um token JWT
 */
router.post('/login', login);

/**
 * @route POST /api/auth/forgot-password
 * @desc Envia link de recuperação de senha por e-mail
 */
router.post('/forgot-password', forgotPassword);

/**
 * @route POST /api/auth/reset-password
 * @desc Redefine a senha usando email + token + nova senha no body
 */
router.post('/reset-password', resetPassword); // 🔥 SEM token na URL

module.exports = router;