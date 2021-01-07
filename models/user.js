const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

let userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        index: true
    },
    role: {
        type: String,
        default: 'subscriber'
    },
    cart: {
        type: Array,
        default: []
    },
    wishlist: [{type:ObjectId, ref:'Product'}],
    address: {
        type: String
    }
}, { timestamps: true })

module.exports = mongoose.model('User', userSchema);