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
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
        validate: {
            validator: async function(students) {
                const count = await mongoose.model('Course').countDocuments({
                  students: {
                    $in: students
                  }
                });
                return count <= 2;
              },
            message: 'User can only be assigned to a maximum of 3 courses'
        }
    }]
});

coursesSchema.index({ name: 1, students: 1 }, { unique: true });

module.exports = mongoose.model('Course', coursesSchema);