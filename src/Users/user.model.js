'user strict'

const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },

    role: {
        type: String,
        default: "ALUMNO",
        uppercase: true,
        enum: ["MAESTRO", "ALUMNO"],
    },
    //Alumno
    grado: {
        type: String,
        //Validación 
        validate: {
            validator: function(value) {  
                console.log(this.get('role'));
              if (this.get('role') !== 'ALUMNO') {
                return false;
              } else {
                return typeof value === 'string' && value.length > 0;
              }
            },
            message: 'El campo "grado" es obligatorio para los usuarios con el rol "Alumno"'
          }
    },

    carnet: {
        type: String,
        validate:{
            validator: function (value) {
                if (this.get('role') !== 'ALUMNO') {
                    return false;
                } else {
                    return typeof value === 'string' && value.length > 0;
                }
            },
            message: 'El campo "carnet es obligatorio" y solo para maestros',
        }
    },

    //Maestro

    titulo: {
        type: String,
        validate:{
            validator: function (value) {
                let role = this.get('role');
                console.log(role);
                if (role !== 'MAESTRO') {
                    return false;
                } else {
                    return typeof value === 'string' && value.length > 0;
                }
            },
            message: 'El campo "titulo" es obligatorio y solo para maestros'
        }
    }
});


exports.setRoleToAlumno = function(next) {
    if (!this.role) {
      this.role = 'ALUMNO';
    }
    next();
  };
  





module.exports = mongoose.model('User', userSchema);



//Middleware for saving default values 

