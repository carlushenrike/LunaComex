const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Operador = sequelize.define('Operador', {
    nome: { type: DataTypes.STRING, allowNull: false },
    pais: { type: DataTypes.STRING, allowNull: false },
    codigoInt: { type: DataTypes.STRING }
}, {
    tableName: 'operadores',
    timestamps: true
});

module.exports = Operador;