const { Router } = require('express');
const router = Router();

const { getByUserID, saveLikedMedia } = require('../controller/likesActionController');

router.post('/add', (req, res) => {
    saveLikedMedia(req.body, (err, result) => {
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

router.get('/userLikes/:uid', (req, res) => {
    getByUserID(req.params.uid, (err, result) => {
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