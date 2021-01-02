const { Router } = require('express');
const router = Router();

const { addAlbums } = require('../controller/albumController');

router.post('/add', (req, res) => {
    addAlbums(req.body, (err, result) => {
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

module.exports = router;