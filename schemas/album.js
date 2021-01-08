const { db } = require('../db.config');
const Sequelize = require('sequelize');

const artist = require('./artist');

const Album = db.define('tbl_album', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
});

Album.belongsTo(artist, { foreignKey: 'artist_id' });

Album.sync({ force: false }).then(() => {
    console.log('Album table created successfully.');
}).catch((err) => {
    console.log('Error in creation of album table: ', err);
});

module.exports = Album;