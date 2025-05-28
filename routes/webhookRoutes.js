// routes/webhookRoutes.js
const express = require('express');
const router = express.Router();
const { processarWebhook } = require('../controllers/webhookController');

/**
 * @route POST /api/webhook
 * @desc Rota pública usada pelo Asaas para notificar pagamento confirmado
 */
router.post('/', processarWebhook);

module.exports = router;