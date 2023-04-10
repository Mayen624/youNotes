const userShemma = require('../models/Users');

const profileRender = async (req,res) => {
    const userInfo = req.user; //All the data about user.
    res.render('../views/layouts/profile', {layout: 'profile.hbs', userName: userInfo.user})
}

const editProfile = async (req,res) => {

}

const addSecretKey = async (req,res) => {

}

const forgotSecretKey = async (req,res) => {

}

module.exports = {profileRender, editProfile, addSecretKey, forgotSecretKey}