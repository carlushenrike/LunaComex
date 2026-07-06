const express = require('express');
const OperadorController = require('../controllers/OperadorController');

const router = express.Router();

// Quando o Angular chamar POST /operadores, manda para o Controller criar
router.post('/', OperadorController.criar);

module.exports = router;