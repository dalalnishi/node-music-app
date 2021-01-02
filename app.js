const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { db } = require('./db.config');

const app = express();
app.use(cors());
  
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//Schemas
const UserSchema = require('./schemas/user');
const ArtistSchema = require('./schemas/artist');
const AlbumSchema = require('./schemas/album');
const TrackSchema = require('./schemas/media');
const LikesActionSchema = require('./schemas/likesAction');

//Routes
const userRoute = require('./routes/userRoute');
app.use('/user', userRoute);

const artistRoute = require('./routes/artistRoute');
app.use('/artist', artistRoute);

const albumRoute = require('./routes/albumRoute');
app.use('/album', albumRoute);

const mediaRoute = require('./routes/trackRoute');
app.use('/track', mediaRoute);

const likesRoute = require('./routes/likesActionRoute');
app.use('/likes', likesRoute);

db.authenticate()
    .then(() => {
        console.log('Database connection has been established successfully.');
    })
    .catch((err) => {
        console.log('Database connection has been established successfully.');
    });

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Listening on Port: ${PORT}.`);
});