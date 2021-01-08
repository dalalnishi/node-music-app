const { Router } = require('express');
const router = Router();

const { addTrack, getAllTracks, searchRecords } = require('../controller/trackController');

router.post('/add', addTrack);
router.get('/allTracks/:user_id/:page/:limit', getAllTracks);
// router.get('/search/:uid', searchRecords);

// router.get('/search/:uid', (req, res) => {
//     const body = {
//         'uid': req.params.uid,
//         'searchString': req.query.searchString
//     }
//     searchRecords(body, (err, result) => {
//         if(err) {
//             res.status = 400;
//             res.json({message: err});
//         }
//         else {
//             res.status = 200;
//             res.json(result);
//         }
//     })
// });

module.exports = router;