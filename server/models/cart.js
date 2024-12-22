const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Product = require('./Product');

const Cart = sequelize.define('Cart', {
    productId: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
}, {
    tableName: 'cart',
    timestamps: true
});

Cart.belongsTo(Product, { foreignKey: 'productId' });

module.exports = Cart;
