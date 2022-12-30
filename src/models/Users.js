const mongoose = require('mongoose');
const bycrypt = require('bcrypt');
const {Schema} = mongoose;

const newUserShemma = new Schema({
    user    : {type: String, unique: true, require: true},
    name    : {type: String},
    lastName: {type: String},
    email   : {type: String, unique: true, require: true},
    password: {type: String},
    image   : {type: String},
    enabled : {type: Boolean}

}, {
    timestamps: true
});

//Don't return the password when the data user is required.
newUserShemma.set('toJSON', {
    transform: (document, returnedObject) => {
        delete returnedObject.password
    }
})


module.exports = mongoose.model('Users', newUserShemma);