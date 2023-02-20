'use strict'

const User = require('./user.model');

const {createToken} = require('../services/jwt');

const {encrypt, validateData, deleteSensitiveData, checkPassword, deletePassword} = require('../services/validate');

const { internal200, internal400, customStatus, internal403, internal500, internal404 } = require('../services/serverStatus');


exports.test = (req, res) => {
    res.send({message: 'User running'});
};


//Alumnos

//Create


exports.savePublic = async (req, res) => {

   try {
    let data = req.body;

    let userRol = 'ALUMNO' 

    !requiredDataNormal(data) ? internal400(res, 'Falta "Grado" y/o "Carnet"', 'Params Required') : null; 

    this.save(req, res, userRol, data);
   } catch (err) {
     console.error(err);
     internal500(res, 'Internal Error', err);
   }
};


exports.savePrivate = async (req, res) => {


    let data = req.body;

    console.log(data);


    let userRol = data.role.toUpperCase();

    console.log(userRol);


    if(userRol == 'MAESTRO') !requiredDataPrivate(data) ? internal400(res, 'Falta "Titulo"', 'Params Required') : null; 
    
    if(userRol == 'ALUMNO')  !requiredDataNormal(data) ? internal400(res, 'Falta "Grado" y/o "Carnet"', 'Params Required') : null;

    this.save(req, res, userRol, data).catch((err) => {
        internal500(res, 'a' , err);
    });    
};

exports.save = async (req, res, userRol, data) => {

    data.role = userRol;


    data.password = await encrypt(data.password);

    let user = new User(data);

    console.log(user);

    await user.save().catch((err) => {

        internal400(res, 'Un campo es invalido', err);
    });

    console.log(data);

    return internal200(res, 'Account Created');

};


const requiredDataNormal = (data) =>{
    console.log({requireNOrmal: data});
    let requiredData = {
        grado: data.grado,
        carnet: data.carnet,
    };

    let msg = validateData(requiredData);
    if(msg) return false;
    
    return true;
};


const requiredDataPrivate = (data) =>{
    console.log({requirePrivate: data});
    let requiredData = {
        titulo: data.titulo,
    };

    let msg = validateData(requiredData);
    if(msg) return false;
    
    return true;
};

 


//Login

exports.login = async(req, res) => {
    try {
        let data = req.body;

        let credentials = {
            username: data.username,
            password: data.password
        };
    
    
        let msg = validateData(credentials);
    
        if(msg) internal400(res, msg);
    
        let userFind = await User.findOne({username: data.username});

        let checkPass = await checkPassword(data.password, userFind.password);

        if(!userFind || !checkPass) return internal403(res, 'Check Your Credentials', 'Auth Error');
    
        let token = await createToken(userFind);
        
        console.log({message: `Logged In As ${userFind.role}`, User: userFind});                
        return customStatus(res, 200, 'Success', token);
    } catch (err) {
        console.error(err);
        return internal500(res, 'Auth Fatal Error', err);
    }

};


//Assign


//Update
exports.update = async(req, res) => {
    try {
        let userId = req.params.id;

        let userFind = await User.findOne({_id: userId});

        !userFind ? internal404(res, 'Account not Found') : null;

        let userLoggedIn = {user: req.user};
        
        let data = req.body;

        deletePassword(data); 

        data.role = userFind.role;

        userLoggedIn.user.sub !== userId ? internal403(res, 'You can only update your user', 'Check user Controller') : null;

        console.log(data);
        
        let userUpdated = await User.findOneAndUpdate(
            {_id: userId},
            data,
            {new: true, runValidators: true}
        ).exec();

        console.log(userUpdated);


        if(!userUpdated){
            throw internal404(res, 'User Not Found',);
        };

        return customStatus(res, 200, 'success', userUpdated); 
    } catch (err) {
        console.error(err);

        return internal500(res, 'Error Updating', err)
    }
};

//Delete

exports.deleteUser = async(req, res) => {
    let userLoggedIn = {user: req.user};

    let userToDelete = req.params.id;

    if(userLoggedIn.user.sub !== userToDelete) return internal403(res, 'Not your user', 'You can only delete your User');

    let deleteAction = await User.findOneAndDelete(
        {_id: userToDelete}
    ).catch((err) => {
        console.error(err);
        internal500(res, 'Error deleting user', err);
    });

    return internal200(res, deleteAction);

};





