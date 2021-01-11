const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
require("dotenv").config();

const db = {};

// connect to postgres testDb
const sequelizeOptions = {
    dialect: 'mysql',
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
};
const sequelize = new Sequelize(
    process.env.DB_NAME, 
    process.env.DB_USER, 
    process.env.DB_PASSWORD,
    sequelizeOptions,
);

const modelsDir = path.normalize(`${__dirname}/models`);

const modelRegister = [];
// loop through all files in models directory ignoring hidden files and this file
fs.readdirSync(modelsDir)
    .filter((file) => (file.indexOf('.') !== 0) && (file.indexOf('.map') === -1))
    // import model files and save model names
    .forEach((file) => {
        console.log(`Loading model file ${file}`);
        const model = require(path.join(`${__dirname}/models`, file))(sequelize, Sequelize.DataTypes);
        db[model.name] = model;
        if (model.addDefaultRecords) {
            setTimeout(() => { model.addDefaultRecords(); }, 10000);
        }
        if (model.registerModels) {
            modelRegister.push({
                register: model.registerModels,
            });
        }
    });

if (!_.isEmpty(modelRegister)) {
    modelRegister.forEach((modelRegisterObj) => {
        modelRegisterObj.register(db);
    });
}

// Synchronizing any model changes with database.
sequelize
    .sync()
    .then(() => {
        console.log('Database synchronized');
    })
    .catch((error) => {
        if (error) {
            console.log('An error occurred: ', error);
        }
    });

// assign the sequelize variables to the db object and returning the db.
module.exports = _.extend({
    sequelize,
    Sequelize,
}, db);
  