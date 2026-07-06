const express = require('express');
const ClassificacaoController = require('../controllers/ClassificacaoController');
const router = express.Router();

// Rota: GET /api/ncm/84713012/atributos
router.get('/:ncm/atributos', ClassificacaoController.buscarAtributos);

module.exports = router;