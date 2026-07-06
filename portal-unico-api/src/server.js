require('dotenv').config();
const express = require('express');
const cors = require('cors');
const operadorRoutes = require('./routes/operador.routes');
const produtoRoutes = require('./routes/produto.routes');
const classificacaoRoutes = require('./routes/classificacao.routes');
const sequelize = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Libera para o Angular
app.use(express.json());

// Registra as rotas
app.use('/api/operadores', operadorRoutes);
app.use('/api/produtos', produtoRoutes);
app.use('/api/ncm', classificacaoRoutes);

sequelize.sync()
    .then(() => {
        console.log('🐘 Conectado ao PostgreSQL!');
        app.listen(PORT, () => console.log(`🚀 API rodando na porta ${PORT}`));
    })
    .catch(err => console.error('❌ Erro no PostgreSQL:', err));