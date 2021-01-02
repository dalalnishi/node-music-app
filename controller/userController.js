const User = require('../schemas/user');

exports.registerUser = (body, done) => {
    User.findOne({where: {email: body.email}}).then((result) => {
        if(result) {
            done({message: 'Email ID already exist.'});
        }
        else {
            User.create(body).then((newUser) => {
                if(newUser) {
                    done(null, newUser);
                }
                else {
                    done({message: 'User not registered'})
                }
            }).catch((err) => {
                done(err);
            });
        }
    }).catch((err) => {
        done(err);
    });
}

exports.loginUser = (body, done) => {
    User.findOne({where: {email: body.email}}).then((result) => {
        if(result) {
            done(null, result);
        }
        else {
            done(err);
        }
    }).catch((err) => {
        done(err);
    });
}