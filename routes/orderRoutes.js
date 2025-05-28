const express = require('express');
const router = express.Router();

const {
  criarPedido,
  buscarPedidoPorUuid,
  listarPedidosDoVendedor,
  obterResumoDashboard, // ✅ importar a função correta
} = require('../controllers/orderController');

const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @route GET /api/orders/user
 * @desc Lista os pedidos dos produtos do vendedor logado (protegido)
 */
router.get('/user', authMiddleware, listarPedidosDoVendedor);

/**
 * @route GET /api/orders/dashboard
 * @desc Retorna os dados resumidos para o Dashboard (protegido)
 */
router.get('/dashboard', authMiddleware, obterResumoDashboard); // ✅ corrigido aqui

/**
 * @route POST /api/orders
 * @desc Cria um novo pedido e gera cobrança no Asaas (público)
 */
router.post('/', criarPedido);

/**
 * @route GET /api/orders/:uuid
 * @desc Retorna os dados públicos do pedido por UUID (público)
 */
router.get('/:uuid', buscarPedidoPorUuid);

module.exports = router;