const { db } = require('../db.config');
const Sequelize = require('sequelize');

const Artist = db.define('tbl_artist', {
    artist_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

Artist.sync({ force: false }).then((res) => {
    console.log('Artist table created successfully.');
}).catch((err) => {
    console.log('Error in creation of artist table: ', err);
});

module.exports = Artist;