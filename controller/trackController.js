const Media = require('../schemas/media');
const axios = require('axios');

const { db } = require('../db.config');
const Sequelize = require('sequelize');

exports.addTrack = (body, done) => {
    axios.get('http://api.napster.com/v2.2/tracks/top?apikey=YTkxZTRhNzAtODdlNy00ZjMzLTg0MWItOTc0NmZmNjU4Yzk4').then((res) => {
        const tracks = res.data.tracks;
        var allTracks = [];
        for(i = 0; i < tracks.length; i++) {
            var obj = {
                track_id: tracks[i].id,
                trackName: tracks[i].name,
                previewURL: tracks[i].previewURL,
                album_id: tracks[i].albumId
            }
            allTracks.push(obj);
        }
        Media.bulkCreate(allTracks).then((resp) => {
            if(resp) {
               done(null, resp);
            }
        })
        .catch((err) => {
            done(err);
        });
    })
    .catch(err => {
        done(err);
    });
}

exports.getAllTracks = (params, done) => {
    // Media.findAll({ 
    //     include: [{ model: Artist, all: true, nested: true }]
    // }).then((res) => {
    //     done(null, res);
    // }).catch((err) => {
    //     done(err);
    // });

    const offset = (params.page - 1) * params.limit; // Lazy loading
    db.query("SELECT t.*, a.album_id, a.albumName, at.artist_id, at.name FROM `tbl_tracks` as t, `tbl_albums` as a, `tbl_artists` as at where t.album_id = a.album_id and a.artistId = at.artist_id LIMIT "+params.limit+ " OFFSET "+offset, { type: Sequelize.QueryTypes.SELECT })
        .then((res) => {
            db.query("SELECT User_id, Track_id from `tbl_likes` WHERE User_id ='"+params.uid+"'", { type: Sequelize.QueryTypes.SELECT })
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
        }).catch(err => {
            done(err);
        });
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