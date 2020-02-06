const Sequelize = require('sequelize');

const connection = new Sequelize('ViralLoad', 'sa', 'disalab', {
    host: 'localhost',
    dialect: 'mssql',
    dialectOptions: {
        options: { requestTimeout: 30000000 }
    },
});

module.exports = connection