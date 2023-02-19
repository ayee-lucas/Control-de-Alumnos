'use strict'

const express = require('express');

const cors = require('cors');

const helmet = require('helmet');

const morgan = require('morgan');


const app = express();
const port = process.env.PORT || 3200;

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

exports.initServer = _ => {
    app.listen(port);
    console.log(`HTTP Server Running on port: ${port}`);
};