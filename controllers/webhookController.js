// controllers/webhookController.js
const axios = require('axios');
const Order = require('../models/Order');
require('dotenv').config();

const ASAAS_TOKEN = process.env.ASAAS_TOKEN;

/**
 * Processa notificações do Asaas e atualiza status de pedidos
 * @route POST /api/webhook
 */
exports.processarWebhook = async (req, res) => {
  const { event, payment } = req.body;

  console.log('[WEBHOOK] 🔔 Evento recebido:', event);

  // Ignora eventos não relacionados a pagamento confirmado
  if (event !== 'PAYMENT_CONFIRMED') {
    console.log('[WEBHOOK] ℹ️ Evento ignorado:', event);
    return res.status(200).send('Evento ignorado');
  }

  try {
    // Consulta o pagamento no Asaas para obter dados confiáveis
    const response = await axios.get(
      `https://www.asaas.com/api/v3/payments/${payment.id}`,
      {
        headers: {
          access_token: ASAAS_TOKEN,
        },
      }
    );

    const dadosPagamento = response.data;
    const uuidPedido = dadosPagamento.externalReference;

    console.log('[WEBHOOK] 🔍 Referência externa recebida:', uuidPedido);

    // Atualiza o pedido com o UUID correspondente
    const pedido = await Order.findOneAndUpdate(
      { uuid: uuidPedido },
      { statusPagamento: 'pago' },
      { new: true }
    );

    if (!pedido) {
      console.warn('[WEBHOOK] ❌ Pedido não encontrado para UUID:', uuidPedido);
      return res.status(404).send('Pedido não encontrado');
    }

    console.log('[WEBHOOK] ✅ Pagamento confirmado e pedido atualizado:', pedido._id);
    res.status(200).send('Webhook processado com sucesso');
  } catch (error) {
    console.error('[WEBHOOK] ❌ Erro ao processar webhook:', error.response?.data || error.message);
    res.status(500).send('Erro ao processar webhook');
  }
};