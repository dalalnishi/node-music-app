const { Router } = require('express');
const router = Router();
const { registerUser, loginUser } = require('../controller/userController');

router.post('/signUp', registerUser);
router.post('/signin', loginUser);

module.exports = router;