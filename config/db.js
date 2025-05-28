// config/db.js
const mongoose = require('mongoose');

/**
 * Conecta ao banco MongoDB usando a URI definida no .env
 * Encerrará o processo se a conexão falhar.
 */
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB conectado');
  } catch (err) {
    console.error('❌ Erro ao conectar no MongoDB:', err.message);
    process.exit(1); // Encerra a aplicação em caso de falha
  }
};

module.exports = connectDB;