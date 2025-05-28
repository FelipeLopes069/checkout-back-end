const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

// Schema do produto
const productSchema = new mongoose.Schema(
  {
    // UUID único para uso em links públicos
    uuid: {
      type: String,
      default: uuidv4,
      unique: true,
    },

    // Nome do produto
    nome: {
      type: String,
      required: true,
    },

    // Descrição do produto
    descricao: {
      type: String,
      required: true,
    },

    // Caminho da imagem do produto
    imagem: {
      type: String,
      required: true,
    },

    // Preço do produto
    preco: {
      type: Number,
      required: true,
    },

    // Referência ao vendedor (usuário)
    vendedor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Campo virtual para gerar link público de compra
productSchema.virtual('linkPublico').get(function () {
  const base = process.env.FRONTEND_URL || 'http://localhost:3000';
  return `${base}/buy/${this.uuid}`;
});

module.exports = mongoose.model('Product', productSchema);