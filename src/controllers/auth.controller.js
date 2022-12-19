const userShemma = require('../models/Users');
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
        let userResult = await userShemma.find({user: User});

        //Auth validation
        if(userResult.length > 0){
            const passResult = await bycript.compare(Password, userResult[0].password)
            if(!passResult){
                authErrors.push({message: 'Usuario o contraseña incorrectos'})
            }
        }else{
            authErrors.push({message: 'Usuario o contraseña incorrectos'})
        }
    }

    //If exist any error
    if(authErrors.length > 0){
        res.render('../views/index', {authErrors, User});
    }else{
        res.send('Auth successfuly!');
    }

}


module.exports = {renderIndexForm, auth}