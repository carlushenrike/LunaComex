const createPortalClient = require('../config/apiClient');
require('dotenv').config();

const OperadorController = {
    // Método para criar um novo operador
    async criar(req, res) {
        try {
            // Pega os dados que vieram do Angular
            const dadosOperador = req.body;
            const cpfCnpjRaiz = process.env.USER_ID; 

            // Instancia o cliente com certificado
            const apiGov = createPortalClient();

            // Chamada Oficial ao Governo
            const response = await apiGov.post(
                `/catp/api/ext/operador-estrangeiro/${cpfCnpjRaiz}/${dadosOperador.codigoPais}`,
                dadosOperador
            );

            // Retorna 201 (Created) para o Angular
            return res.status(201).json(response.data);

        } catch (error) {
            console.error("Erro no Controller de Operador:", error.message);

            // Tratamento de erros de infraestrutura (Certificado/Rede)
            if (error.code === 'ECONNRESET' || error.code === 'EPROTO') {
                return res.status(502).json({
                    code: "CERTIFICATE_ERROR",
                    message: "Falha na conexão segura com o Siscomex. Verifique o certificado digital."
                });
            }

            // Tratamento de erros de negócio (Dados inválidos retornados pelo Governo)
            if (error.response) {
                return res.status(error.response.status).json(error.response.data);
            }

            return res.status(500).json({ message: "Erro interno do servidor." });
        }
    },

    // Futuro: Método para listar, editar, etc.
    async listar(req, res) {
        // ... lógica de listagem ...
    }
};

module.exports = OperadorController;