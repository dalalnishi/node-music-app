const { Router } = require('express');
const router = Router();
const { addArtist } = require('../controller/artistController');

router.post('/add', addArtist);

module.exports = router;