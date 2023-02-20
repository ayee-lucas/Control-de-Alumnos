'use strict'

const bcrypt = require('bcrypt');


exports.validateData = (data) => {
    let keys = Object.keys(data), msg = '';
    for (const key of keys) {
        if(data[key] !== null && data[key] !== undefined && data[key] !== '' ) continue;
        msg += `The param "${key}" is required  `; 
    };

    return msg.trim();
};


exports.encrypt = async(input) => {
    try {
        return bcrypt.hashSync(input, 10);
    } catch (err) {
        console.error(err);
        return err;
    }
};

exports.checkPassword = async (raw, hash) => {
    try {
        return bcrypt.compare(raw, hash);
    } catch (err) {
        console.error(err);
        return err;
    }
};

exports.deleteSensitiveData = (user) => {
    try {
        delete user.password;
        delete user.role;
    } catch (err) {
        console.error(err);
        return false;
    }
};


exports.deletePassword = update => {
    if(!update) return 'No data has been sent deleting pass';
    delete update.password;
    return update;
};