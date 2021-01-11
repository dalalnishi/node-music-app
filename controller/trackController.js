const db = require('../db.config');
const axios = require('axios');
require("dotenv").config();

const { tbl_artist: Artist, tbl_album: Album, tbl_media: Media, tbl_likes: Likes } = db;

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const { RequestInputError } = require('../shared/errors');

exports.addTrack = async (req, res) => {
    try {
        const response = await axios.get('http://api.napster.com/v2.2/tracks/top?apikey='+process.env.TRACK_APIKEY);
        const { tracks } = response.data;
        if(!tracks) throw new RequestInputError('Failed to fetch Tracks data');

        const allTracks = tracks.map((track) => {
            return {
                id: track.id,
                name: track.name,
                previewURL: track.previewURL,
                // album_id: track.albumId
            }
        });

        const createdTracks = await Media.bulkCreate(allTracks);
        if(!createdTracks) throw new RequestInputError('Failed to create new Tracks.');
        return res.status(201).json(createdTracks);
    } catch (error) {
        if (error.error_code === 'RequestInputError') {
            return res.status(403).send({ error: true, message: error.message });
        }
        res.status(500).send({ error: true, message: 'Error occurred while creating new Tracks.'+error });
    }
}

exports.getAllTracks = async (req, res) => {
    try {
        const { page, limit, user_id } = req.params;
        const offset = (page - 1) * limit; // Lazy loading
        let tracks = await Media.findAll({
            include: [
                { 
                    model: Album,
                    include: [
                        { 
                            model: Artist,
                        },
                    ]
                },
            ],
            limit: parseInt(limit, 10),
            offset: offset
        });
        if(!tracks) throw new RequestInputError('Failed to fetch Tracks records.');
        
        const userLikes = await Likes.findAll({
            where: {
                user_id: user_id
            }
        });

        if(userLikes.length) {
            userLikes.map((item) => {
                return tracks.map((x) => {
                    if(x.id === item.track_id) {
                        x.dataValues.like = true;
                    }
                })
            });
        }
        tracks = tracks.map((x) => {
            return {
                Track_id: x.id,
                Track_name: x.name,
                previewURL: x.previewURL,
                Album_id: x.tbl_album.id,
                Album_name: x.tbl_album.name,
                Artist_id: x.tbl_album.tbl_artist.id,
                Artist_name: x.tbl_album.tbl_artist.name,
                like: x.dataValues.like || false
            };
        });
        return res.status(200).json(tracks);
    } catch (error) {
        if (error.error_code === 'RequestInputError') {
            return res.status(403).send({ error: true, message: error.message });
        }
        res.status(500).send({ error: true, message: 'Error occurred while fetching Tracks data.'+error });
    }
}

exports.searchRecords = async (req, res) => {
    try {
        let searchResult = await Media.findAll({
            include: [
                { 
                    model: Album,
                    include: [
                        { 
                            model: Artist,
                        },
                    ]
                },
            ],
            where: {
                [Op.or]: [
                    {
                        name: {
                            [Op.like]: '%'+ req.query.searchString +'%',
                        }
                    },
                    {
                        '$tbl_album.name$': {
                            [Op.like]: '%'+ req.query.searchString +'%',
                        }
                    },
                    {
                        '$tbl_album.name$': {
                            [Op.like]: '%'+ req.query.searchString +'%',
                        }
                    },
                    {
                        '$tbl_album.tbl_artist.name$': {
                            [Op.like]: '%'+ req.query.searchString +'%',
                        }
                    },
                ]
               
            }
        });
        if(!searchResult) throw new RequestInputError('Failed to search Tracks.');

        const userLikes = await Likes.findAll({
            where: {
                user_id: req.params.user_id
            }
        });

        if(userLikes.length) {
            userLikes.map((item) => {
                return searchResult.map((x) => {
                    if(x.id === item.track_id) {
                        x.dataValues.like = true;
                    }
                })
            });
        }
        searchResult = searchResult.map((x) => {
            return {
                Track_id: x.id,
                Track_name: x.name,
                previewURL: x.previewURL,
                Album_id: x.tbl_album.id,
                Album_name: x.tbl_album.name,
                Artist_id: x.tbl_album.tbl_artist.id,
                Artist_name: x.tbl_album.tbl_artist.name,
                like: x.dataValues.like || false
            };
        });
        return res.status(200).json(searchResult);
    } catch (error) {
        if (error.error_code === 'RequestInputError') {
            return res.status(403).send({ error: true, message: error.message });
        }
        res.status(500).send({ error: true, message: 'Error occurred while searching Tracks data.'+error });
    }
}