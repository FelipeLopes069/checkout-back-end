const mongoose = require('mongoose'); // Conexão com MongoDB

// Schema do usuário
const userSchema = new mongoose.Schema(
  {
    // Nome do usuário
    nome: {
      type: String,
      required: true,
    },

    // E-mail do usuário (único)
    email: {
      type: String,
      required: true,
      unique: true,
    },

    // Senha com hash
    senha: {
      type: String,
      required: true,
    },

    // Token para recuperação de senha
    resetToken: {
      type: String,
      default: null,
    },

    // Expiração do token de redefinição
    resetTokenExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // Cria campos createdAt e updatedAt
  }
);

module.exports = mongoose.model('User', userSchema);