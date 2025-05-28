const axios = require('axios');
require('dotenv').config(); // Carrega variáveis de ambiente do .env

// Instância configurada do Axios para comunicação com a API do Asaas
const asaasApi = axios.create({
  baseURL: 'https://sandbox.asaas.com/api/v3', // Endpoint base da API
  headers: {
    access_token: process.env.ASAAS_TOKEN, // Token de acesso seguro
    'Content-Type': 'application/json',
  },
});

module.exports = asaasApi;