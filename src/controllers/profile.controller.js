const { generateHash } = require('../config/bycrypt');
const userShemma = require('../models/Users');
const calculateAge = require('../helpers/calculateAge');
const { encrypt, decrypt } = require('../config/crypto');
const { format } = require('date-fns');
const dotenv = require('dotenv');
dotenv.config()

const profileRender = async (req, res) => {
    const userInfo = req.user; //All the data about user.
    res.render('../views/layouts/profile', { layout: 'profile.hbs', userName: userInfo.user, userInfo, dateJoin: format(userInfo.createdAt, 'dd/MM/yyyy'), })
}

const editProfile = async (req, res) => {

    //console.log(req.file);

    const userData = req.user;
    const { id, names, work, sex, age } = req.body;
    const formattedAge = calculateAge(age);

    if (!id || !names || !work || !sex || !age) {
        req.flash('error_msg', 'Todos los campos son requeridos.');
        return res.redirect('/profile');
    }

    if (formattedAge <= 8) {
        req.flash('error_msg', 'Debes ser mayor a 8 años.');
        return res.redirect('/profile');
    }

    if (names === userData.names && work === userData.work && sex === userData.sex && formattedAge == userData.age) {
        req.flash('error_msg', 'Los datos no pueden ser los mismos.');
        return res.redirect('/profile');
    }

    try {
        if (req.uploadError) {
            req.flash('error_msg', req.uploadError.message);
            return res.redirect('/profile');
        } else {
            await userShemma.findByIdAndUpdate(
                id,
                {
                    names: names, work: work, sex: sex, age: formattedAge,
                    image: {
                        name: req.file == undefined || null ? 'User.jpg' : req.file.filename,
                        orgName: req.file == undefined || null ? 'User.jpg' : req.file.originalname,
                        size: req.file == undefined || null ? 7023 : req.file.size
                    }
                }

            );
            req.flash('success_msg', 'Tus datos han sido actualizados.');
            return res.redirect('/profile');
        }
    } catch (e) {
        console.log(e)
    }

}

const addSecretKey = async (req, res) => {
    const { sKey } = req.body;
    const userData = req.user;

    if (!sKey) {
        req.flash('error_msg', 'Llave requrida!, tu llave te ayudara a proteger tus notas mas importantes y poder crear notas de categoria recordatorio.');
        res.redirect('/profile');
    } else {
        try {
            const hashedKey = await generateHash(sKey);
            await userShemma.findByIdAndUpdate(userData._id, { key: hashedKey });
            req.flash('success_msg', 'Tu llave fue existosamente creada, ahora puedes crear notas de categoria "credenciales".');
            res.redirect('/profile');
        } catch (e) {
            return console.log(e)
        }
    }
}

const renderForgotSecretKey = async (req, res) => {
    res.render('../views/partials/forgotKeyForm');
}

const forgotSecretKey = async (req, res) => {
   const {phone} = req.body;
   const userData = req.user;

    if(!phone){
        req.flash('error_msg', 'Numero de telefono requerido');
        return res.redirect('/profile/forgotKey');
    }

    const notFound = await userShemma.findOne({phone: phone});
    if(!notFound){
        req.flash('error_msg', 'El numero de telefono ingresado no esta registrado.');
        return res.redirect('/profile/forgotKey');
    }

    //close session after send code

}

const renderCreateNewKey = async (req, res) => {
   
}

const createNewKey = async (req, res) => {
    const {code, sKey, confSKey} = req.params;
}

module.exports = {
    profileRender, editProfile, addSecretKey, 
    renderForgotSecretKey, forgotSecretKey,
    renderCreateNewKey, createNewKey
}