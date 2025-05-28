const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// rotas
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const webhookRoutes = require('./routes/webhookRoutes');

dotenv.config();
connectDB();

const app = express();

// ✅ Libera o frontend (ex: localhost:3000) pra acessar a API
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

// ✅ Permite envio de JSON no corpo
app.use(express.json());

// ✅ Serve arquivos estáticos da pasta /uploads (acesso às imagens)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get('/', (req, res) => {
  res.send('🚀 API do Checkout funcionando');
});

// rotas principais
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/webhook', webhookRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🟢 Servidor rodando na porta ${PORT}`));