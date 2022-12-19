const newUserShemma = require('../models/Users');
const bycrypt = require('bcrypt');

const signupRenderForm = async (req,res) => {
    res.render('../views/signup');
};

const addUser = async (req,res) => {

    //Variables declaration
    const errors = [];
    const emailRegexr = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const passwordRegexr = /^(?=(.*[\d]){2,})(?=(.*[a-z]){2,})(?=(.*[A-Z]){1,})(?=(.*[@#$%!]){1,})(?:[\da-zA-Z@#$%!]){8,100}$/g;
    
    //Data came from req post
    const {User, Email, Password, confirmPass} = req.body;

    //Password validations
    if(!passwordRegexr.test(Password)){
        errors.push({message: `La contraseña debe de contener: 
            2 o mas letras minusculas, 1 o mas letras mayusculas, 2 o mas numeros, 1 o mas caracteres especiales y debe ser mayor a 8 caracteres.`
        })
    }

    if(Password !== confirmPass){
        errors.push({message: 'Las contraseñas no coinciden.'});
    }

    //User validation
    if(User.length < 4){
        errors.push({message: 'Usuario debe ser mayor a cuatro caracteres.'});
    }

    const userRepeat = await newUserShemma.find({user: User});

    if(userRepeat.length > 0){
        errors.push({message: 'Usuario ya existente.'})
    }

    //Email validations

    const emailRepeat = await newUserShemma.find({email: Email});

    if(emailRepeat.length > 0){
        errors.push({message: 'Correo electronico ya existente.'});
    }

    if(!emailRegexr.test(Email)){
        errors.push({message: 'Correo electronico no valido.'});
    }

    //If there's no error the user will be save
    if(errors.length > 0){
        res.render('../views/signup', {errors, User, Email, Password});
    }else{

        const salts = await bycrypt.genSalt(10);

        const UserObj = {
            user: User,
            name: '',
            lastName: '',
            email: Email,
            password: await bycrypt.hash(Password, salts),
            image: '',
            enabled: false
        }

        const addUser = new newUserShemma(UserObj);
        await addUser.save();
        req.flash('success_msg', 'Usuario creado exitosamente!');
        res.redirect('/signup');
       
    }
}

const updateUser = async () => {

}

module.exports = {signupRenderForm, addUser, updateUser}