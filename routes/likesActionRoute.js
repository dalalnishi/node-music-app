const { Router } = require('express');
const router = Router();
const { getByUserID, saveLikedMedia } = require('../controller/likesActionController');

router.post('/add', saveLikedMedia);
router.get('/userLikes/:user_id', getByUserID);

module.exports = router;