const mongoose = require('mongoose');
const bycrypt = require('bcrypt');
const {Schema, model} = mongoose;

const newUserShemma = new Schema({
    user        : {type: String, unique: true, require: true},
    names       : {type: String},
    work        : {type: String, default: null},
    sex         : {type: String, default: null},
    age         : {type: String, default: null},
    key         : {type: String, default: null},
    email       : {type: String, unique: true, require: true},
    phone       : {type: String, unique: true, require: true},
    password    : {type: String},
    image       : {type: Object, default: null},
    enabled     : {type: Boolean},
    code        : {type: String, default: null},
    reset_token : {type: String, default: null}

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