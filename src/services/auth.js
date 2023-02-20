'use strict'

const jwt = require('jsonwebtoken');
const { internal403, internal400, internal500 } = require('./serverStatus');


exports.ensureAuth = (req, res, next) => {
    if(!req.headers.authorization){
        return internal403(res, 'Authorization headers no content', 'check middleware');
    } else {
        try {
            let token = req.headers.authorization.replace(/['"]/g, '');
            
            var payload = jwt.decode(token, `${process.env.SECRET_KEY}`);

            if (Math.floor(Date.now() / 1000) >= payload.exp){
                return internal403(res, 'Token Expired', err);
            };
        } catch (err) {
            console.error(err);
            return internal400(res, 'An error has occurred validating authentication');
        }
        req.user = payload;
        next();
    };
};



exports.isMaestro = (req, res, next) => {
    try {
        let user = req.user;

        if(user.role !== 'MAESTRO') return internal403(res, 'Access Denied', err);
        next();
    } catch (err) {
        console.error(err);
        return internal500(res, 'Auth has failed, Private Route requires an user with access', '');
    }
};



exports.headerSent = (req, res, next) => {
    if (!res.headersSent) {
        next();
      } else {
        console.log('Headers already sent');
      }
};