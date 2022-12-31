const userShemma = require('../models/Users');
const LocalStrategy = require('passport-local');
const passport = require('passport');
const mongoose = require('mongoose');
const bycript = require('bcrypt');

const renderIndexForm = async (req,res) => {
    res.render('../views/index');
}

const auth = async (req,res) => {
    
    const {User, Password} = req.body;

    const authErrors = [];

    //Fields validation
    if(User == '' || Password == ''){
        authErrors.push({message:'Poravor ingrese un usuario y contraseña'});
    }else{
        //if User exist in db
        let userResult = await userShemma.findOne({user: User});

        console.log(userResult)

        //Auth validation
        

        // if(userResult.length > 0){
        //     const passResult = await bycript.compare(Password, userResult.password)
        //     passport.use(new PassportLocal(async function(userame, password, done){
        //         if(!passResult){
        //             authErrors.push({message: 'Usuario o contraseña incorrectos'})
        //         }
        //     }))
        // }else{
        //     authErrors.push({message: 'Usuario o contraseña incorrectos'})
        // }
    }

    //If exist any error
    if(authErrors.length > 0){
        res.render('../views/index', {authErrors, User});
    }else{
        res.redirect('/notes')
    }

}


module.exports = {renderIndexForm, auth}