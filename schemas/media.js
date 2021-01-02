const { db } = require('../db.config');
const Sequelize = require('sequelize');

const Album = require('./album');

const Media = db.define('tbl_tracks', {
    track_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true,
    },
    trackName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    previewURL: {
        type: Sequelize.STRING,
        allowNull: false
    },
    album_id: {
        type: Sequelize.UUID,
    }
});

Media.belongsTo(Album);
Album.hasMany(Media);

Album.sync({ force: false }).then((res) => {
    console.log('Album table created successfully.');
    Media.sync({ force: false }).then((res) => {
        console.log('Track table created successfully.');
    }).catch((err) => {
        console.log('Error in creation of track table: ', err);
    });
}).catch((err) => {
    console.log('Error in creation of album table: ', err);
});

module.exports = Media;