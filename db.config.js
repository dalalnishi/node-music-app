const Sequelize = require('sequelize');
require("dotenv").config();

exports.db = new Sequelize('test_db', process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: process.env.DB_PORT
})
  