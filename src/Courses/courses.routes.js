'user strict'

const express = require('express');
const { ensureAuth, isMaestro } = require('../services/auth');
const { enrollUser, addCourse } = require('./courses.controller');
const api = express.Router();

api.post('/add', [ensureAuth, isMaestro], addCourse);
api.put('/enroll/:id', ensureAuth ,enrollUser);

module.exports = api;


