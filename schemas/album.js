const { db } = require('../db.config');
const Sequelize = require('sequelize');

const artist = require('./artist');

const Album = db.define('tbl_album', {
    album_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true,
    },
    albumName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    artistId: {
        type: Sequelize.UUID,
    }
});

Album.belongsTo(artist);
artist.hasMany(Album);

artist.sync({ force: false }).then((res) => {
    console.log('Artist table created successfully.');
    Album.sync({ force: false }).then((res) => {
        console.log('Album table created successfully.');
    }).catch((err) => {
        console.log('Error in creation of album table: ', err);
    });
}).catch((err) => {
    console.log('Error in creation of artist table: ', err);
})

module.exports = Album;