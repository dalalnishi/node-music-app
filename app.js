const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require("dotenv").config();

const app = express();
app.use(cors());
  
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const routes = require('./routes/index');
app.use(routes);

app.get('/', function (req, res) {
    return res.send('This is Music site!!');
});

const PORT = process.env.LISTEN_PORT || 4000;
app.listen(PORT, () => {
    console.log(`Listening on Port: ${PORT}.`);
});