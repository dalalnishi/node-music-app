const Artist = require('../schemas/artist');
const axios = require('axios');

exports.addArtist = (body, done) => {
    axios.get('https://api.napster.com/v2.2/artists/top?apikey=ZTk2YjY4MjMtMDAzYy00MTg4LWE2MjYtZDIzNjJmMmM0YTdm').then((res) => {
        const artists = res.data.artists;
        var allArtists = [];
        for(i = 0; i < artists.length; i++) {
            var obj = {
                artist_id: artists[i].id,
                name: artists[i].name
            }
            allArtists.push(obj);
        }
        Artist.bulkCreate(allArtists).then((resp) => {
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