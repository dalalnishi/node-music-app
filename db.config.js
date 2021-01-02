const Sequelize = require('sequelize');

exports.db = new Sequelize('entertainment_db', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306
})
  