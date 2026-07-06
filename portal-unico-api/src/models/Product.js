const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
    userId: { type: DataTypes.STRING, allowNull: false },
    companyId: { type: DataTypes.STRING, allowNull: false },
    cpfCnpjRaiz: { type: DataTypes.STRING },
    codigo: { type: DataTypes.STRING, allowNull: false, unique: true },
    versao: { type: DataTypes.STRING, defaultValue: '1' },
    ncm: { type: DataTypes.STRING, allowNull: false },
    denominacao: { type: DataTypes.STRING, allowNull: false },
    detalhamentoComplementar: { type: DataTypes.TEXT },
    modalidade: {
        type: DataTypes.ENUM('IMPORTACAO', 'EXPORTACAO', 'AMBAS'),
        defaultValue: 'IMPORTACAO'
    },
    situacao: {
        type: DataTypes.ENUM('ATIVO', 'INATIVO', 'RASCUNHO', 'NAO_PUBLICADO'),
        defaultValue: 'RASCUNHO'
    },
    // PostgreSQL suporta JSON nativo!
    atributos: { type: DataTypes.JSONB, defaultValue: [] },
    fabricante: { type: DataTypes.JSONB, defaultValue: {} },
    operadorEstrangeiro: { type: DataTypes.JSONB, defaultValue: {} }
}, {
    tableName: 'products',
    timestamps: true
});

module.exports = Product;