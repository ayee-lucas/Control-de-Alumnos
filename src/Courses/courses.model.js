'use strict'


const mongoose = require('mongoose');

const coursesSchema = mongoose.Schema({
    name:{
        type: String,
        require: true,
        unique: true
    },
    description:{
        type: String,
        require: true
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
/*         validate: validator = function (value) {
            
        } */
    },
    student: {
        type:  mongoose.Schema.Types.ObjectId, ref: 'User'
    }
});


module.exports = mongoose.model('Course', coursesSchema);