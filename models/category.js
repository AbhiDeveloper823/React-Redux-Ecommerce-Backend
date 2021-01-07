const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength:[2, 'Too short'],
        maxlength:[32, 'Too Long'],
        trim:true
    },
    slug:{
        type:String,
        lowercase:true,
        unique:true,
        index:true
    }
}, {timestamps:true})

module.exports = mongoose.model('Category', categorySchema)