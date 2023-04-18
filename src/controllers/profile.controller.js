const userShemma = require('../models/Users');
const {format} = require('date-fns');

const profileRender = async (req, res) => {
    const userInfo = req.user; //All the data about user.
    res.render('../views/layouts/profile', { layout: 'profile.hbs', userName: userInfo.user, userInfo, dateJoin: format(userInfo.createdAt, 'dd/MM/yyyy'), })
}

const editProfile = async (req, res) => {
    const { } = req.query;
}

const addSecretKey = async (req, res) => {
    const { sKey } = req.body;
    const userData = req.user;

    if (!sKey) {
        req.flash('error_msg', 'Llave requrida!, tu llave te ayudara a proteger tus notas mas importantes y poder crear notas de categoria recordatorio.');
        res.redirect('/profile');
    } else {
        try {
            await userShemma.findByIdAndUpdate(userData._id, { key: sKey })
            req.flash('success_msg', 'Tu llave fue existosamente creada, ahora puedes crear notas de categoria "recordatorio".');
            res.redirect('/profile');
        } catch (e) {
            return console.log(e)
        }
    }
}

const forgotSecretKey = async (req, res) => {

}

module.exports = { profileRender, editProfile, addSecretKey, forgotSecretKey }