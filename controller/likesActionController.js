const { db } = require('../db.config');
const Sequelize = require('sequelize');
const LikesAction = require('../schemas/likesAction');

exports.saveLikedMedia = (body, done) => {
    var count = 0;
    db.query("SELECT count(*) as cnt from `tbl_likes` WHERE User_id='"+body.User_id+"' AND Track_id='"+body.Track_id+"'", { type: Sequelize.QueryTypes.SELECT }).then((res) =>{
        if(res) {
            count = res[0].cnt;
            if(count > 0) {
                db.query("DELETE FROM `tbl_likes` WHERE User_id='"+body.User_id+"' AND Track_id='"+body.Track_id+"'").then((res) => {
                    done(null, res);
                })
                .catch(err => {
                    done(err);
                })
            }
            else {
                LikesAction.create(body).then((resp) => {
                    if(resp) {
                        done(null, resp);
                    }
                })
                .catch((err) => {
                    done(err);
                });
            }
        }
    });
}

exports.getByUserID = (uid, done) => {
    db.query("SELECT t.*, a.album_id, a.albumName, at.artist_id, at.name FROM `tbl_likes` as l, `tbl_users` as u, `tbl_tracks` as t, `tbl_albums` as a, `tbl_artists` as at WHERE l.User_id='"+uid+"'and l.User_id = u.id and l.Track_id = t.Track_id and t.album_id = a.album_id and a.artistId = at.artist_id", { type: Sequelize.QueryTypes.SELECT })
        .then((res) => {
            done(null, res);
        }).catch(err => {
            done(err);
        });
}