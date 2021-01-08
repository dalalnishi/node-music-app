const User = require('../schemas/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const salt = bcrypt.genSaltSync(10);
const secretKey = 'STkey';

const { RequestInputError } = require('../shared/errors');

exports.registerUser = async (req, res) => {
    try {
        var hash = bcrypt.hashSync(req.body.password, salt);
        req.body.password = hash;

        const user = await User.findOne({where: {email: req.body.email}});
        if(user) throw new RequestInputError('Email ID already exist.');
        
        const newUser = await User.create(req.body);
        if(!newUser) throw new RequestInputError('Try again.! Unable to register the user.');
        return res.status(201).json({ newUser });
    } catch (error) {
        if (error.error_code === 'RequestInputError') {
            return res.status(403).send({ error: true, message: error.message });
        }
        res.status(500).send({ error: true, message: 'Error occurred while registering new user.' });
    }
}

exports.loginUser = async (req, res) => {
    try {
        const user = await User.findOne({where: {email: req.body.email}});
        if(user) {
            var hash = bcrypt.compareSync(req.body.password, user.password);
            if(!hash) {
                throw new RequestInputError('Password Incorrect.');
            } else {
                const token = jwt.sign({email: user.email}, secretKey, {
                    expiresIn: 86400
                });
                return res.status(200).json({ token, user });
            }
        } else {
            throw new RequestInputError('User not found.');
        }
    } catch (error) {
        if (error.error_code === 'RequestInputError') {
            return res.send({ error: true, message: error.message });
        }
        res.status(500).send({ error: true, message: 'Error occurred while user login process.' });
    }
}