const Album = require('../schemas/album');
const axios = require('axios');
require("dotenv").config();

const { RequestInputError } = require('../shared/errors');

exports.addAlbums = async (req, res) => {
    try {
        const response = await axios.get('http://api.napster.com/v2.2/albums/top?apikey='+process.env.ALBUM_APIKEY);
        const { albums } = response.data;
        if(!albums) throw new RequestInputError('Failed to fetch Albums data');

        const allAlbums = albums.map((album) => {
            return {
                id: album.id,
                name: album.name,
                // artist_id: album.contributingArtists.primaryArtist,
            };
        });
        const createdAlbums = await Album.bulkCreate(allAlbums);
        if(!createdAlbums) throw new RequestInputError('Failed to create new Albums.');
        return res.status(201).json(createdAlbums);
    } catch (error) {
        if (error.error_code === 'RequestInputError') {
            return res.status(403).send({ error: true, message: error.message });
        }
        res.status(500).send({ error: true, message: 'Error occurred while creating new Albums.'+error });
    }
}