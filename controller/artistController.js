const Artist = require('../schemas/artist');
const axios = require('axios');
require("dotenv").config();

const { RequestInputError } = require('../shared/errors');

exports.addArtist = async (req, res) => {
    try {
        const response = await axios.get('https://api.napster.com/v2.2/artists/top?apikey='+process.env.ARTIST_APIKEY);
        const { artists } = response.data;
        if(!artists) throw new RequestInputError('Failed to fetch Artists data');

        const allArtists = artists.map((artist) => {
            return {
                id: artist.id,
                name: artist.name
            }
        });

        const createdArtists = await Artist.bulkCreate(allArtists);
        if(!createdArtists) throw new RequestInputError('Failed to create Artists.');
        return res.status(201).json(createdArtists);
    } catch (error) {
        if (error.error_code === 'RequestInputError') {
            return res.send({ error: true, message: error.message });
        }
        res.status(500).send({ error: true, message: 'Error occurred while creating new Artists.'+error });
    }
}