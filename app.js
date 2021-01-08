const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require("dotenv").config();
const { db } = require('./db.config');

const routes = require('./routes/index');
require('./schemas/index');

const app = express();
app.use(cors());
  
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(routes);

app.get('/', function (req, res) {
    return res.send('This is Music site!!');
});

db.authenticate()
    .then(() => {
        console.log('Database connection has been established successfully.');
    })
    .catch((err) => {
        console.log('Database connection failed.');
    });

const PORT = process.env.LISTEN_PORT || 4000;
app.listen(PORT, () => {
    console.log(`Listening on Port: ${PORT}.`);
});