const mongoose = require('mongoose');
const bycrypt = require('bcrypt');
const {Schema, model} = mongoose;

const newUserShemma = new Schema({
    user    : {type: String, unique: true, require: true},
    names   : {type: String},
    work    : {type: String},
    sex     : {type: String},
    age     : {type: String},
    key     : {type: String},
    email   : {type: String, unique: true, require: true},
    password: {type: String},
    image   : {type: String},
    enabled : {type: Boolean}

}, {
    timestamps: true
});


newUserShemma.methods.encryptPassword = async password => {
    const salt = await bycrypt.genSalt(10);
    return await bycrypt.hash(password, salt);
},

newUserShemma.methods.matchPassword = async function (pass){
    return await bycrypt.compare(pass, this.password);
}


module.exports = model('Users', newUserShemma);