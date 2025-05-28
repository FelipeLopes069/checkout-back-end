require('dotenv').config();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Função auxiliar para gerar token JWT válido por 7 dias
const gerarToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// REGISTRO DE USUÁRIO
const register = async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    const existe = await User.findOne({ email });
    if (existe) {
      return res.status(400).json({ message: 'E-mail já cadastrado.' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);
    const novo = await User.create({ nome, email, senha: senhaHash });
    const token = gerarToken(novo._id);

    return res.status(201).json({ token });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao registrar.', error: error.message });
  }
};

// LOGIN DE USUÁRIO
const login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    const senhaOk = await bcrypt.compare(senha, user.senha);
    if (!senhaOk) {
      return res.status(401).json({ message: 'Senha incorreta.' });
    }

    const token = gerarToken(user._id);
    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json({ message: 'Erro no login.', error: error.message });
  }
};

// ESQUECI MINHA SENHA - envia link com token JWT por e-mail
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const link = `http://localhost:3000/resetar-senha?token=${token}&email=${email}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Suporte Avyo" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: 'Redefinição de Senha',
      html: `
        <h2>Redefinir Senha</h2>
        <p>Olá, ${user.nome}.</p>
        <p>Clique abaixo para redefinir sua senha:</p>
        <a href="${link}" style="padding:10px 15px;background:#4F46E5;color:#fff;text-decoration:none;border-radius:4px;">Redefinir Senha</a>
        <p>Ou copie o link: ${link}</p>
      `,
    });

    return res.json({ message: 'E-mail enviado com sucesso.' });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao enviar e-mail.', error: error.message });
  }
};

// REDEFINIÇÃO DE SENHA - verifica token e atualiza senha
const resetPassword = async (req, res) => {
  const { token, email, novaSenha } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ _id: decoded.id, email });
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    const senhaHash = await bcrypt.hash(novaSenha, 10);
    user.senha = senhaHash;
    await user.save();

    return res.json({ message: 'Senha redefinida com sucesso.' });
  } catch (error) {
    return res.status(400).json({ message: 'Token inválido ou expirado.', error: error.message });
  }
};

// Exporta todas as funções para uso nas rotas
module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
};