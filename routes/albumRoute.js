const { Router } = require('express');
const router = Router();
const { addAlbums } = require('../controller/albumController');

router.post('/add', addAlbums);

module.exports = router;