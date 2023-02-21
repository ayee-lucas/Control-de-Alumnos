'user strict'

const express = require('express');
const { ensureAuth, isMaestro } = require('../services/auth');
const { enrollUser, addCourse, getUsersEnrolledCourses, editCourses, getMaestroCourses, deleteCourse } = require('./courses.controller');
const api = express.Router();

api.post('/add', [ensureAuth, isMaestro], addCourse);
api.put('/enroll', ensureAuth ,enrollUser);
api.get('/coursesEnrolled/:id', ensureAuth, getUsersEnrolledCourses);
api.get('/maestroCourses/:id', [ensureAuth, isMaestro], getMaestroCourses);
api.put('/editCourse/:id', [ensureAuth, isMaestro], editCourses);
api.delete('/deleteCourse/:id', [ensureAuth, isMaestro], deleteCourse);

module.exports = api;


