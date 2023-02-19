'use strict'

const mongoose = require('mongoose');


exports.connect = async () => {
    const uriMongo = `${process.env.URI_MONGO}`;
    mongoose.set('strictQuery', false);
    await mongoose.connect(uriMongo);
    console.log('Connected to DB');
};

