const { db } = require('../db.config');
const Sequelize = require('sequelize');

const User = db.define('tbl_user', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true,
    },
    firstName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    lastName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    gender: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

User.sync({ force: false }).then((res) => {
    console.log('User table created successfully.');
}).catch((err) => {
    console.log('Error in creation of user table: ', err);
});

module.exports = User;