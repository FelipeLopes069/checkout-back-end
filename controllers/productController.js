const Product = require('../models/Product');
const { v4: uuidv4 } = require('uuid');

/**
 * Cria um novo produto vinculado ao vendedor logado
 * @route POST /api/products
 */
exports.criarProduto = async (req, res) => {
  const { nome, descricao, imagem, preco } = req.body;

  console.log("📦 [CRIAR PRODUTO] Dados recebidos:", {
    nome,
    descricao,
    preco,
    imagem,
    vendedor: req.user,
  });

  try {
    const novoProduto = await Product.create({
      nome,
      descricao,
      imagem,
      preco,
      vendedor: req.user,
      uuid: uuidv4(), // ✅ Geração do UUID
    });

    console.log("✅ Produto criado com sucesso:", novoProduto._id);
    res.status(201).json(novoProduto);
  } catch (error) {
    console.error("❌ Erro ao criar produto:", error.message);
    res.status(500).json({
      mensagem: 'Erro ao criar produto',
      erro: error.message,
    });
  }
};

/**
 * Lista todos os produtos do vendedor logado
 * @route GET /api/products
 */
exports.listarProdutos = async (req, res) => {
  console.log("📄 [LISTAR PRODUTOS] Vendedor:", req.user);

  try {
    const produtos = await Product.find({ vendedor: req.user });
    console.log(`🔍 ${produtos.length} produtos encontrados.`);
    res.status(200).json(produtos);
  } catch (error) {
    console.error("❌ Erro ao buscar produtos:", error.message);
    res.status(500).json({
      mensagem: 'Erro ao buscar produtos',
      erro: error.message,
    });
  }
};

/**
 * Atualiza um produto do vendedor logado
 * @route PUT /api/products/:id
 */
exports.atualizarProduto = async (req, res) => {
  const { id } = req.params;
  console.log("✏️ [ATUALIZAR PRODUTO] ID:", id, "Dados:", req.body);

  try {
    const produto = await Product.findOneAndUpdate(
      { _id: id, vendedor: req.user },
      req.body,
      { new: true }
    );

    if (!produto) {
      console.warn("⚠️ Produto não encontrado para atualização:", id);
      return res.status(404).json({ mensagem: 'Produto não encontrado' });
    }

    console.log("✅ Produto atualizado:", produto._id);
    res.status(200).json(produto);
  } catch (error) {
    console.error("❌ Erro ao atualizar produto:", error.message);
    res.status(500).json({
      mensagem: 'Erro ao atualizar produto',
      erro: error.message,
    });
  }
};

/**
 * Deleta um produto do vendedor logado
 * @route DELETE /api/products/:id
 */
exports.deletarProduto = async (req, res) => {
  const { id } = req.params;
  console.log("🗑️ [DELETAR PRODUTO] ID:", id, "Vendedor:", req.user);

  try {
    const produto = await Product.findOneAndDelete({
      _id: id,
      vendedor: req.user,
    });

    if (!produto) {
      console.warn("⚠️ Produto não encontrado para deletar:", id);
      return res.status(404).json({ mensagem: 'Produto não encontrado' });
    }

    console.log("✅ Produto deletado com sucesso:", produto._id);
    res.status(200).json({ mensagem: 'Produto deletado com sucesso' });
  } catch (error) {
    console.error("❌ Erro ao deletar produto:", error.message);
    res.status(500).json({
      mensagem: 'Erro ao deletar produto',
      erro: error.message,
    });
  }
};

/**
 * Retorna os dados públicos de um produto via UUID
 * @route GET /api/products/uuid/:uuid
 */
exports.buscarProdutoPorUuid = async (req, res) => {
  const { uuid } = req.params;
  console.log("🔎 [BUSCAR PRODUTO POR UUID]:", uuid);

  try {
    const produto = await Product.findOne({ uuid });

    if (!produto) {
      return res.status(404).json({ mensagem: 'Produto não encontrado' });
    }

    res.status(200).json(produto);
  } catch (error) {
    console.error("❌ Erro ao buscar produto por UUID:", error.message);
    res.status(500).json({
      mensagem: 'Erro ao buscar produto por UUID',
      erro: error.message,
    });
  }
};