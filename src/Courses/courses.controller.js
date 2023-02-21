'use strict'

const User = require('../Users/user.model');


const {validateData, deleteSensitiveData} = require('../services/validate');
const Course = require('../Courses/courses.model');
const { internal500, internal200, internal400, internal403, internal404 } = require('../services/serverStatus');


//Add Course

exports.addCourse = async(req, res) => {
    let data = req.body;

    delete data.student;

    console.log(data.teacher);

    let findTeacher = await User.findOne(
        {username: data.teacher}
    ).catch((err) => {
        console.error(err);
        internal404(res, 'Teacher not found');
    });

    console.log({message: 'Teacher Founded', findTeacher});

    let teacherId = findTeacher._id.toString();

    data.teacher = teacherId;

    console.log(teacherId);

    console.log(data);

    let newCourse = new Course(data);

    let checkData = (
        {
            name: data.name,
            description: data.description,
            teacher: data.teacher
        }
    );
    let msg = validateData(checkData);
    if(msg) return internal403(res, 'Invalid Input', 'Check Name, Description or teacher');
    

    await newCourse.save().catch((err) => {
        console.log(err);
        internal500(res, 'Error saving course', err)
    })

    return internal200(res, newCourse);

};


//User Enroll

exports.enrollUser = async(req, res) => {
    let data = req.body;

    let userLoggedIn = {user: req.user};

    let checkData = ({student: data.name});

    let msg = validateData(checkData);
    
    if(msg) return internal403(res, 'Invalid Input', 'Check course name'); 

    
    userLoggedIn.user.role == 'MAESTRO' ? internal403(res, 'This route is only for normal users', 'Not your route') : null;

    let userFinded = await User.findOne(
        {username: userLoggedIn.user.username}
    );

    console.log(userFinded);

    delete userFinded.password;

    const course = await Course.findOneAndUpdate(
        {name: data.name},
        {$addToSet: { students: userFinded.id }},
        {new: true, runValidators: true}
    ).populate('students').populate('teacher').catch((err) => {
        console.error(err);
        return internal500(res, 'Error enrolling to a course', err);
    });

    !userFinded || !course ? internal404(res, 'User or Course not defined') : null;

    console.log({userFinded: userFinded, course: course});
    
    return internal200(res, course);
};


//User get courses



exports.getUsersEnrolledCourses = async(req, res,) => {
    
   
    let userLoggedIn = {user: req.user};

    let userId = req.params.id;
  
    userLoggedIn.user.role == 'MAESTRO' ? internal403(res, 'This route is only for normal users', 'Not your route') : null;

    userLoggedIn.user.sub !== userId ? internal403(res, 'Auth Failed', 'This is not your user') : null;

    let coursesFinded = await Course.find(
        {students: {_id: userId} }
    ).catch((err) => {
        console.error(err);
        return internal500(res, 'Error Finding Courses', err);
    });

    return internal200(res, coursesFinded);
    
};


//Maestro get


exports.getMaestroCourses = async(req, res,) => {
    
    let userLoggedIn = {user: req.user};

    let userId = req.params.id;
  
    userLoggedIn.user.sub !== userId ? internal403(res, 'Auth Failed', 'This is not your user') : null;

    let coursesFinded = await Course.find(
        {teacher: {_id: userId} }
    ).catch((err) => {
        console.error(err);
        return internal500(res, 'Error Finding Courses', err);
    });

    return internal200(res, coursesFinded);
    
};


// Maestro Update

exports.editCourses = async(req, res) => {

    let data = req.body;

    let courseId = req.params.id

    delete data.teacher;
    delete data.student

    let checkData = (
        {
            name: data.name,
            description: data.description
        }
    );

    let msg = validateData(checkData);
    if(msg) return internal403(res, 'Invalid Input', 'Check Name or Description');

    let userLoggedIn = {user: req.user};

    let coursesFinded = await Course.findOne(
        {_id: courseId},
    ).catch((err) => {
        console.error(err);
        return internal500(res, 'Error Finding Courses', err);
    });
    
    let teacherOwncourse_Id = coursesFinded.teacher.toString();


    teacherOwncourse_Id !== userLoggedIn.user.sub ? internal403(res, "You don't have access", 'Error Updating Course') : null;

    !coursesFinded ? internal404(res, 'courses not founded') : null;

    const courseUpdated = await Course.findOneAndUpdate(
        {_id: courseId},
        data,
        {new: true}
    ).populate('students').populate('teacher').catch((err) => {
        console.error(err);
        return internal500(res, 'Error updating course', err);
    });

    return internal200(res, courseUpdated);

};


exports.deleteCourse = async(req, res) => {

    let courseId = req.params.id

    let userLoggedIn = {user: req.user};

    let coursesFinded = await Course.findOne(
        {_id: courseId},
    ).catch((err) => {
        console.error(err);
        return internal500(res, 'Error Finding Courses', err);
    });

    console.log(coursesFinded);
    
    let teacherOwncourse_Id = coursesFinded.teacher.toString();


    teacherOwncourse_Id !== userLoggedIn.user.sub ? internal403(res, "You don't have access", 'Error Updating Course') : null;

    !coursesFinded ? internal404(res, 'courses not founded') : null;

    const courseDeleted = await Course.findOneAndDelete(
        {_id: courseId}
    );

    return internal200(res, courseDeleted);
};