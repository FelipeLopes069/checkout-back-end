require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const Order = require('../models/Order');
const Product = require('../models/Product');
const asaasApi = require('../services/asaasApi');

// Cria um novo pedido com cliente e cobrança via Asaas
const criarPedido = async (req, res) => {
  const { produtoId, nomeCliente, emailCliente, documento, telefone } = req.body;

  try {
    // Verifica se o produto existe
    const produto = await Product.findById(produtoId);
    if (!produto) {
      return res.status(404).json({ mensagem: 'Produto não encontrado' });
    }

    // Gera UUID para o pedido
    const uuidPedido = uuidv4();

    // Cria cliente no Asaas
    const clienteAsaas = await asaasApi.post('/customers', {
      name: nomeCliente,
      email: emailCliente,
      cpfCnpj: documento,
      phone: telefone,
    });

    const customerId = clienteAsaas.data.id;

    // Gera cobrança no Asaas
    const cobranca = await asaasApi.post('/payments', {
      customer: customerId,
      billingType: 'PIX',
      value: produto.preco,
      dueDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
      description: produto.nome,
      externalReference: uuidPedido,
    });

    const linkPagamento = cobranca.data.invoiceUrl;
    const paymentId = cobranca.data.id;

    // Salva pedido no banco
    const novoPedido = await Order.create({
      uuid: uuidPedido,
      produto: produto._id,
      nomeCliente,
      emailCliente,
      documento,
      telefone,
      linkPagamento,
      statusPagamento: 'pendente',
      asaasPaymentId: paymentId,
    });

    res.status(201).json({ pedido: novoPedido });
  } catch (error) {
    res.status(500).json({
      mensagem: 'Erro ao criar pedido',
      erro: error.response?.data || error.message,
    });
  }
};

// Busca um pedido por UUID (página pública de detalhes)
const buscarPedidoPorUuid = async (req, res) => {
  const { uuid } = req.params;

  try {
    const pedido = await Order.findOne({ uuid }).populate('produto');
    if (!pedido) {
      return res.status(404).json({ mensagem: 'Pedido não encontrado' });
    }

    res.status(200).json({
      nomeCliente: pedido.nomeCliente,
      emailCliente: pedido.emailCliente,
      statusPagamento: pedido.statusPagamento,
      linkPagamento: pedido.linkPagamento,
      criadoEm: pedido.createdAt,
      produto: {
        nome: pedido.produto.nome,
        descricao: pedido.produto.descricao,
        preco: pedido.produto.preco,
        imagem: pedido.produto.imagem,
      },
    });
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao buscar pedido', erro: error.message });
  }
};

// Lista os pedidos associados ao vendedor logado
const listarPedidosDoVendedor = async (req, res) => {
  try {
    const produtos = await Product.find({ vendedor: req.user });
    const ids = produtos.map(p => p._id);
    const pedidos = await Order.find({ produto: { $in: ids } }).populate('produto');

    const totalPedidos = pedidos.length;
    const totalVendas = pedidos
      .filter(p => p.statusPagamento === 'pago')
      .reduce((soma, p) => soma + (p.produto?.preco || 0), 0);

    res.status(200).json({ totalPedidos, totalVendas, pedidos });
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao buscar pedidos', erro: error.message });
  }
};

// Retorna um resumo da operação para o painel do vendedor
const obterResumoDashboard = async (req, res) => {
  try {
    const produtos = await Product.find({ vendedor: req.user });
    const ids = produtos.map(p => p._id);
    const pedidos = await Order.find({ produto: { $in: ids } }).populate('produto');

    const totalPedidos = pedidos.length;
    const totalVendas = pedidos
      .filter(p => p.statusPagamento === 'pago')
      .reduce((soma, p) => soma + (p.produto?.preco || 0), 0);

    const clientesUnicos = new Set(pedidos.map(p => p.emailCliente)).size;

    res.status(200).json({
      totalPedidos,
      totalVendas,
      produtos: produtos.length,
      clientes: clientesUnicos,
      pedidos,
    });
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao obter resumo', erro: error.message });
  }
};

// Exporta os controladores
module.exports = {
  criarPedido,
  buscarPedidoPorUuid,
  listarPedidosDoVendedor,
  obterResumoDashboard,
};