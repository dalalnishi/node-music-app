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
});

LikesAction.belongsTo(User, { foreignKey: 'user_id' });
LikesAction.belongsTo(Track, { foreignKey: 'track_id' });

LikesAction.sync({ force: false }).then(() => {
    console.log('Likes table created successfully.');
}).catch((err) => {
    console.log('Error in creation of likes table: ', err);
});

module.exports = LikesAction;