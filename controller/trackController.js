const Media = require('../schemas/media');
const Album = require('../schemas/album');
const Likes = require('../schemas/likesAction');
const axios = require('axios');
require("dotenv").config();

const { db } = require('../db.config');
const Sequelize = require('sequelize');

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
        return res.status(201).json({ createdTracks });
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
                { model: Album, all: true, nested: true },
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
        } else {
            return res.status(200).json(tracks);
        }
    } catch (error) {
        if (error.error_code === 'RequestInputError') {
            return res.status(403).send({ error: true, message: error.message });
        }
        res.status(500).send({ error: true, message: 'Error occurred while fetching Tracks data.'+error });
    }
}

exports.searchRecords = (reqParams, done) => {
    db.query("SELECT t.*, a.album_id, a.albumName, at.artist_id, at.name FROM `tbl_tracks` as t, `tbl_albums` as a, `tbl_artists` as at where t.album_id = a.album_id and a.artistId = at.artist_id and (t.trackName like '"+reqParams.searchString+"%' OR a.albumName like '"+reqParams.searchString+"%' OR at.name like '"+reqParams.searchString+"%')", { type: Sequelize.QueryTypes.SELECT })
        .then((res) => {
            db.query("SELECT User_id, Track_id from `tbl_likes` WHERE User_id ='"+reqParams.uid+"'", { type: Sequelize.QueryTypes.SELECT })
            .then((data) => {
                data.map((item) => {
                    return res.map((x) => {
                        if(x.track_id === item.Track_id) {
                            x.like = true;
                        }                        
                    })
                });
                done(null, res);
            }).catch(err => {
                done(err);
            });
        })
        .catch(err => {
            done(err);
        });
}