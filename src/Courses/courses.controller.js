'use strict'

const User = require('../Users/user.model');


const {validateData} = require('../services/validate');
const Course = require('../Courses/courses.model');
const { internal500, internal200, internal400, internal403 } = require('../services/serverStatus');

//Add Course

exports.addCourse = async(req, res) => {
    let data = req.body;

    delete data.teacher;
    delete data.student;

    console.log(data);

    let newCourse = new Course(data);

    let checkData = (
        {
            name: data.name,
            description: data.description
        }
    );
    let msg = validateData(checkData);
    if(msg) return internal403(res, 'Invalid Input', 'Check Name, Description');
    

    await newCourse.save().catch((err) => {
        console.log(err);
        internal500(res, 'Error saving course', err)
    })

    return internal200(res, newCourse);

};


//User Enroll

exports.enrollUser = async(req, res) => {
    let data = req.body;


    let checkData = ({student: data.student});

    let msg = validateData(checkData);
    if(msg) return internal403(res, 'Invalid Input', 'Check Name, Description');

    let userLoggedIn = {user: req.user};

    let userFinded = await User.findOne(
        {_id: userLoggedIn.user.sub}
    );

    let course = await Course.findOne(
        {_id: req.params.id}
    );


    console.log({userFinded: userFinded, course: course});

    return userFinded;
};
