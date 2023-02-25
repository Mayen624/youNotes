const mongoose = require('mongoose');
const {model, Schema} = mongoose;

const categoryShemma = new Schema({
    name: {type:String, unique: true, required: true}
})

module.exports = model('categories', categoryShemma);