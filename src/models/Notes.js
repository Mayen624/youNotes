const { ObjectId, Timestamp } = require('mongodb');
const mongoose = require('mongoose');
const {model, Schema} = mongoose;

const notesShemma = new Schema({
    id_user     : {type: ObjectId, require: true, ref: 'Users'},
    titulo      : {type: String, require: true},
    categoria   : {type: String, require: true},
    contenido   : {type: String, require: true},
    createdAt   : {type: String, requiere: true},
    updatedAt   : {type: String, requiere: true},
    isEncrypted : {type: Boolean, default: false}
})

module.exports = model('notes', notesShemma);