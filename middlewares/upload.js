const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Define o caminho da pasta de uploads
const pastaUploads = path.resolve(__dirname, "..", "uploads");

// Cria a pasta caso ainda não exista
if (!fs.existsSync(pastaUploads)) {
  fs.mkdirSync(pastaUploads);
}

// Configuração de armazenamento do multer
const storage = multer.diskStorage({
  // Define o diretório onde o arquivo será salvo
  destination: (req, file, cb) => {
    cb(null, pastaUploads);
  },

  // Define o nome do arquivo salvo
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const nome = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, nome);
  },
});

// Cria o middleware de upload
const upload = multer({ storage });

// Exporta o middleware
module.exports = upload;