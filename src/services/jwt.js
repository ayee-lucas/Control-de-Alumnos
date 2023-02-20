const jwt = require('jsonwebtoken');

exports.createToken = async user => {
    try {
        let payload = {
            sub: user._id,
            name: user.name,
            surname: user.surname,
            username: user.username,
            email: user.email,
            phone: user.phone,
            role: user.role,
            iat: Math.floor(Date.now() / 1000),
            iexp: Math.floor(Date.now() / 1000) + (60 + 120)
        };
        return jwt.sign(payload, process.env.SECRET_KEY);
    } catch (err) {
        console.error('jwt error, token not created', err);
        return err;
    }
};