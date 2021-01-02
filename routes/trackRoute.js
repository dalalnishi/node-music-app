const { Router } = require('express');
const router = Router();

const { addTrack, getAllTracks } = require('../controller/trackController');

router.post('/add', (req, res) => {
    addTrack(req.body, (err, result) => {
        if(err) {
            res.status = 400;
            res.json({message: err});
        }
        else {
            res.status = 201;
            res.json(result);
        }
    })
});

router.get('/allTracks/:uid', (req, res) => {
    getAllTracks(req.params.uid, (err, result) => {
        if(err) {
            res.status = 400;
            res.json({message: err});
        }
        else {
            res.status = 200;
            res.json(result);
        }
    })
});

module.exports = router;