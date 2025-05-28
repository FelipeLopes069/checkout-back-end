# 🛒 Checkout Backend – Desafio Técnico

Sistema completo de backend para fluxo de vendas com:

- Cadastro e login de vendedores  
- CRUD de produtos  
- Criação de pedidos públicos com link de pagamento via PIX (Asaas)  
- Webhook para atualização automática do status de pagamento  

---

## ✅ Funcionalidades

- Cadastro e autenticação com JWT  
- Gerenciamento de produtos  
- Criação de pedidos com UUID público  
- Integração com Asaas para gerar cobranças PIX  
- Webhook para atualizar o status do pedido  
- Consulta pública de pedido via UUID  

---

## ⚙️ Tecnologias Utilizadas

- Node.js + Express  
- MongoDB + Mongoose  
- JWT (autenticação)  
- Bcrypt.js (hash de senha)  
- UUID (rastreamento)  
- Axios  
- Asaas API  

---

## 🛠️ Como instalar e rodar o projeto

### 1. Clone o repositório

```bash
git clone https://github.com/FelipeLopes069/checkout-back-end.git
cd checkout-back-end

# Com Yarn
yarn install
yarn dev

# Ou com NPM
npm install
npm run dev

checkout-backend/
├── config/            # Configuração do MongoDB
├── controllers/       # Lógica das rotas
├── middlewares/       # Autenticação e segurança
├── models/            # Schemas do MongoDB
├── routes/            # Rotas organizadas
├── .env.example       # Exemplo de variáveis de ambiente
├── server.js          # Entrada da aplicação
└── README.md          # Documentação do projeto