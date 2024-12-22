const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Category = require('./Category');

const Product = sequelize.define('Product', {
    title: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    image: { type: DataTypes.TEXT },
}, {
    tableName: 'product', // Match the table name
    timestamps: false // Disable automatic creation of createdAt and updatedAt
});

Product.belongsTo(Category, { foreignKey: 'categoryId' });

module.exports = Product;
