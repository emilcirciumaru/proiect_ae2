const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('store2', 'root', 'parola123', {
    host: '127.0.0.1',
    dialect: 'mysql',
});

module.exports = sequelize;
