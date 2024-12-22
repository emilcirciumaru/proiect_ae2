const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Category = sequelize.define('Category', {
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
}, {
    tableName: 'category', // Match the table name
    timestamps: false // Disable automatic creation of createdAt and updatedAt
});

module.exports = Category;

