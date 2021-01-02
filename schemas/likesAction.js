const { db } = require('../db.config');
const Sequelize = require('sequelize');

const User = require('./user');
const Track = require('./media');

const LikesAction = db.define('tbl_likes', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true,
    },
    User_id: {
        type: Sequelize.UUID,
    },
    Track_id: {
        type: Sequelize.UUID,
    }
});

LikesAction.belongsTo(User);
User.hasMany(LikesAction);

LikesAction.belongsTo(Track);
Track.hasMany(LikesAction);

User.sync({ force: false }).then((res) => {
    console.log('User table created successfully.');
    LikesAction.sync({ force: false }).then((res) => {
        console.log('Likes table created successfully.');
    }).catch((err) => {
        console.log('Error in creation of likes table: ', err);
    });
}).catch((err) => {
    console.log('Error in creation of User table: ', err);
});

Track.sync({ force: false }).then((res) => {
    console.log('Track table created successfully.');
    LikesAction.sync({ force: false }).then((res) => {
        console.log('Likes table created successfully.');
    }).catch((err) => {
        console.log('Error in creation of likes table: ', err);
    });
}).catch((err) => {
    console.log('Error in creation of Track table: ', err);
});

module.exports = LikesAction;