const Sequelize = require('sequelize');

const connection = new Sequelize('guiaperguntas', 'root', 'zmhx8wqc', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = connection;