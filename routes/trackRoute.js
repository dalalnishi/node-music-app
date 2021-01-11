const { Router } = require('express');
const router = Router();

const { addTrack, getAllTracks, searchRecords } = require('../controller/trackController');

router.post('/add', addTrack);
router.get('/allTracks/:user_id/:page/:limit', getAllTracks);
router.get('/search/:user_id', searchRecords);

module.exports = router;