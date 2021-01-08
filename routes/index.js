const { Router } = require('express');
const router = Router();

router.use('/user', require('./userRoute'));
router.use('/artist', require('./artistRoute'));
router.use('/album', require('./albumRoute'));
router.use('/track', require('./trackRoute'));
router.use('/likes', require('./likesActionRoute'));

module.exports = router;
