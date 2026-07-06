const Product = require('../models/Product');

const ProdutoController = {
    async criar(req, res) {
        try {
            const dados = {
                ...req.body,
                userId: req.body.userId || '07865339356'
            };
            const produtoSalvo = await Product.create(dados);
            res.status(201).json(produtoSalvo);
        } catch (error) {
            res.status(400).json({ erro: error.message });
        }
    },

    async listar(req, res) {
        try {
            const produtos = await Product.findAll({ order: [['createdAt', 'DESC']] });
            res.json(produtos);
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    },

    async atualizar(req, res) {
        try {
            const { id } = req.params;
            const [updated] = await Product.update(req.body, { where: { id } });
            if (updated) {
                const produtoAtualizado = await Product.findByPk(id);
                return res.json(produtoAtualizado);
            }
            res.status(404).json({ erro: 'Produto não encontrado' });
        } catch (error) {
            res.status(400).json({ erro: error.message });
        }
    },
    
    async deletar(req, res) {
        try {
            const { id } = req.params;
            const deleted = await Product.destroy({ where: { id } });
            if (deleted) return res.status(204).send();
            res.status(404).json({ erro: 'Produto não encontrado' });
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }
};

module.exports = ProdutoController;