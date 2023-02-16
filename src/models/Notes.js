const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const {model, Schema} = mongoose;

const notesShemma = new Schema({
    id_user     : {type: ObjectId, require: true, ref: 'Users'},
    titulo      : {type: String, require: true},
    categoria   : {type: String, require: true},
    contenido   : {type: String, require: true},
    fecha       : {type: Date, require: true} 
})

module.exports = model('notes', notesShemma);