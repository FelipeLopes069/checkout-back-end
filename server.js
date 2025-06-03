// Importa o framework Express para criar o servidor HTTP
const express = require('express');

// Carrega variáveis de ambiente do arquivo .env
const dotenv = require('dotenv');

// Middleware para lidar com CORS (Cross-Origin Resource Sharing)
const cors = require('cors');

// Utilitário do Node.js para manipular caminhos de arquivos
const path = require('path');

// Função para conectar ao banco de dados (MongoDB)
const connectDB = require('./config/db');

// Importa as rotas do projeto, organizadas por funcionalidade
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const webhookRoutes = require('./routes/webhookRoutes');

// Inicializa as variáveis de ambiente (PORT, DB_URI etc)
dotenv.config();

// Conecta ao banco de dados
connectDB();

// Cria a aplicação Express
const app = express();

// Lista de domínios liberados para fazer requisições (CORS)
const allowedOrigins = [
  "http://localhost:3000", // Frontend local para desenvolvimento
  "https://checkout-front-end-rust.vercel.app" // Frontend deployado no Vercel
];

// Configura CORS com validação customizada do origin
app.use(cors({
  origin: function (origin, callback) {
    // Permite requisições sem origin (ex: Postman) ou de origens autorizadas
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // aceita a requisição
    } else {
      callback(new Error("Not allowed by CORS")); // bloqueia origem não autorizada
    }
  },
  credentials: true // permite envio de cookies/autenticação
}));

// Habilita o Express a interpretar o corpo das requisições em JSON
app.use(express.json());

// Serve arquivos estáticos da pasta /uploads na rota /uploads
// Exemplo: acesso a imagens salvas no servidor
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Rota simples de teste para verificar se o servidor está ativo
app.get('/', (req, res) => {
  res.send('🚀 API do Checkout funcionando');
});

// Monta as rotas principais da API, agrupadas por funcionalidade
app.use('/api/auth', authRoutes);       // Autenticação de usuários
app.use('/api/products', productRoutes); // Produtos do sistema
app.use('/api/orders', orderRoutes);    // Pedidos realizados
app.use('/api/webhook', webhookRoutes); // Webhooks externos

// Define a porta do servidor: variável de ambiente ou 5000 como padrão
const PORT = process.env.PORT || 5000;

// Inicializa o servidor e exibe no console que está rodando
app.listen(PORT, () => console.log(`🟢 Servidor rodando na porta ${PORT}`));