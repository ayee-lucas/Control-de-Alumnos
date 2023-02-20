'use strict'

exports.customStatus = (res, httpStatus, message, obj) => {
    let msgReturn = res.status(httpStatus).send({message: message, obj});
    return msgReturn;
};

exports.internal200 = (res, obj) => {
    let msgReturn = res.status(200).send({message:`Server 200: OK.`, obj: obj});
    return msgReturn;
};

exports.internal201 = (res, message) => {
    let msgReturn = res.status(201).send({message:`Server 201: CREATED. ${message}`});
    return msgReturn;
};


exports.internal202 = (res, message) => {
    let msgReturn = res.status(202).send({status:'Server 202 Deleted Successfully:', message: message});
    return msgReturn
};

exports.internal500 = (res, message, err) => {
    let msgReturn = res.status(500).send({message:`Server 500: Internal Server Error. ${message}`, error: err.message});
    return msgReturn;
};

exports.internal400 = (res, message, err) => {
    let msgReturn = res.status(400).send({message:`Server 400: Bad Request. ${message}`, error: err});
    return msgReturn;
};

exports.internal404 = (res, message) => {
    let msgReturn = res.status(404).send({message:`Server 404:  Not Found. ${message}`});
    return msgReturn;
};

exports.internal403 = (res, message, err) => {
    let msgReturn = res.status(404).send({message:`Server 403:  Forbidden. ${message}`, error: err});
    return msgReturn;
};