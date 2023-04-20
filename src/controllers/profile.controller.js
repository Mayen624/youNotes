const userShemma = require('../models/Users');
const calculateAge = require('../helpers/calculateAge');
const bcrypt = require('bcrypt');
const CryptoJS = require('crypto-js');
const { format } = require('date-fns');

const profileRender = async (req, res) => {
    const userInfo = req.user; //All the data about user.
    res.render('../views/layouts/profile', { layout: 'profile.hbs', userName: userInfo.user, userInfo, dateJoin: format(userInfo.createdAt, 'dd/MM/yyyy'), })
}

const editProfile = async (req, res) => {
    const userData = req.user;
    const { id, names, work, sex, age, img } = req.body;
    const formattedAge = calculateAge(age);

    if (!id || !names || !work || !sex || !age || !img) {
        req.flash('error_msg', 'Todos los campos son requeridos.');
        return res.redirect('/profile');
    }

    if (names === userData.names && work === userData.work && sex === userData.sex && formattedAge == userData.age) {
        req.flash('error_msg', 'Los datos no pueden ser los mismos.');
        return res.redirect('/profile');
    }

    try {
        await userShemma.findByIdAndUpdate(id, { names: names, work: work, sex: sex, age: formattedAge });
        req.flash('success_msg', 'Tus datos han sido actualizados.');
        return res.redirect('/profile');
    } catch (err) {
        console.error(err);
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
            const salts = await bcrypt.genSalt(10);
            const sKeyHashed = await bcrypt.hash(sKey, salts);
            await userShemma.findByIdAndUpdate(userData._id, { key: sKeyHashed });
            req.flash('success_msg', 'Tu llave fue existosamente creada, ahora puedes crear notas de categoria "credenciales".');
            res.redirect('/profile');
        } catch (e) {
            return console.log(e)
        }
    }
}

const forgotSecretKey = async (req, res) => {

}

module.exports = { profileRender, editProfile, addSecretKey, forgotSecretKey }