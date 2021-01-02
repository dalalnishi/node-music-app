const Album = require('../schemas/album');
const axios = require('axios');

exports.addAlbums = (body, done) => {
    axios.get('http://api.napster.com/v2.2/albums/top?apikey=YTkxZTRhNzAtODdlNy00ZjMzLTg0MWItOTc0NmZmNjU4Yzk4').then((res) => {
        const albums = res.data.albums;
        var allAlbums = [];
        for(i = 0; i < albums.length; i++) {
            var obj = {
                album_id: albums[i].id,
                albumName: albums[i].name,
                // artistId: albums[i].contributingArtists.primaryArtist,
            }
            allAlbums.push(obj);
        }
        Album.bulkCreate(allAlbums).then((resp) => {
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