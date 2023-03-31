const userShemma = require('../models/Users');

const profileRender = async (req,res) => {
    const userInfo = req.user; //All the data about user.
    res.render('../views/layouts/profile', {layout: 'profile.hbs', userName: userInfo.user})
}

module.exports = {profileRender}