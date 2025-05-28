// models/Order.js
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

/**
 * Schema do Pedido (Order)
 * Cada pedido representa a compra de um produto por um cliente
 */
const orderSchema = new mongoose.Schema(
  {
    uuid: {
      type: String,
      default: uuidv4, // Gerado automaticamente
      unique: true,
    },
    produto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product', // Referência ao produto comprado
      required: true,
    },
    nomeCliente: {
      type: String,
      required: true,
    },
    emailCliente: {
      type: String,
      required: true,
    },
    documento: {
      type: String, // CPF ou CNPJ do cliente
      required: true,
    },
    telefone: {
      type: String,
      required: true,
    },
    statusPagamento: {
      type: String,
      default: 'pendente', // Alternativas: 'pendente' ou 'pago'
    },
    linkPagamento: {
      type: String, // URL da cobrança gerada no Asaas
    },
  },
  {
    timestamps: true, // Adiciona createdAt e updatedAt automaticamente
  }
);

module.exports = mongoose.model('Order', orderSchema);