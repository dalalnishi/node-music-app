const { db } = require('../db.config');
const Sequelize = require('sequelize');

const Album = require('./album');

const Media = db.define('tbl_tracks', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    previewURL: {
        type: Sequelize.STRING,
        allowNull: false
    },
});

Media.belongsTo(Album, { foreignKey: 'album_id' });

Media.sync({ force: false }).then((res) => {
    console.log('Track table created successfully.');
}).catch((err) => {
    console.log('Error in creation of track table: ', err);
});

module.exports = Media;