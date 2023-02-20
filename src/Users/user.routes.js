'use strict'

const express = require('express');

const{ensureAuth, isMaestro} = require('../services/auth');

//const() = require('./user.model');

const {test, save, update, login, savePublic, savePrivate, deleteUser} = require('../Users/user.controller');

const api = express.Router();


api.get('/', test);
api.post('/register', savePublic);
api.post('/register/private',[ensureAuth, isMaestro], savePrivate);
api.post('/login', login);
api.put('/edit/:id', ensureAuth , update);
api.delete('/delete/:id', ensureAuth , deleteUser);

module.exports = api; 