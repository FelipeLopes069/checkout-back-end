const express = require('express');
const router = express.Router();

const {
  criarProduto,
  listarProdutos,
  atualizarProduto,
  deletarProduto,
  buscarProdutoPorUuid, // ✅ Nova função importada
} = require('../controllers/productController');

const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload'); // Middleware do multer

/**
 * @route POST /api/products
 * @desc Cria um novo produto
 */
router.post('/', authMiddleware, criarProduto);

/**
 * @route GET /api/products
 * @desc Lista os produtos do vendedor logado
 */
router.get('/', authMiddleware, listarProdutos);

/**
 * @route PUT /api/products/:id
 * @desc Atualiza um produto do vendedor logado
 */
router.put('/:id', authMiddleware, atualizarProduto);

/**
 * @route DELETE /api/products/:id
 * @desc Remove um produto do vendedor logado
 */
router.delete('/:id', authMiddleware, deletarProduto);

/**
 * @route POST /api/products/upload
 * @desc Faz upload da imagem do produto
 */
router.post(
  '/upload',
  authMiddleware,
  upload.single('imagem'),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ mensagem: 'Nenhuma imagem enviada.' });
    }

    const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    console.log("📤 Imagem enviada com sucesso:", url);
    res.status(200).json({ url });
  }
);

/**
 * @route GET /api/products/uuid/:uuid
 * @desc Retorna os dados públicos de um produto via UUID
 */
router.get('/uuid/:uuid', buscarProdutoPorUuid); // ✅ Rota pública

module.exports = router;