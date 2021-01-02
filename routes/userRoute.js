const { Router } = require('express');
const router = Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

var salt = bcrypt.genSaltSync(10);
var secretKey = 'STkey';

const { registerUser, loginUser } = require('../controller/userController');

router.post('/signUp', (req, res) => {
    var hash = bcrypt.hashSync(req.body.password, salt);
    req.body.password = hash;
    registerUser(req.body, (err, result) => {
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

router.post('/signin', (req, res) => {
    loginUser(req.body, (err, result) => {
        if(err) {
            res.status(400).send({message: err,  result: false});
        }
        else {
            var hash = bcrypt.compareSync(req.body.password, result.password);
            if(hash) {
                var token = jwt.sign({email: result.email}, secretKey, {
                    expiresIn: 86400
                });
                res.status(200).send({message: 'Log-in successful.', result: true, token: token, id: result.id, firstName: result.firstName, lastName: result.lastName, email: result.email});
            }
            else {
                res.status(400).send({ message: 'Password Incorrect', result: false });
            }
        }
    })
});

module.exports = router;