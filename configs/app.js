'use strict'

const express = require('express');

const cors = require('cors');

const helmet = require('helmet');

const morgan = require('morgan');

require('express-async-errors');


const userRoutes = require('../src/Users/user.routes');
const coursesRoutes = require('../src/Courses/courses.routes');


const app = express();
const port = process.env.PORT || 3200;




app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));



app.use('/user', userRoutes);
app.use('/courses', coursesRoutes)


exports.initServer = _ => {
    app.listen(port);
    console.log(`HTTP Server Running on port: ${port}`);
};