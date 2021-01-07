const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema;

const orderSchema = new mongoose.Schema({
    products:[
        {
            product:{
                type:ObjectId,
                ref:'Product'
            },
            color:String,
            count:Number,
            price:Number
        }
    ],
    orderStatus:{
        type:String,
        default:'Not Proccessed', 
        enum:['Not Proccessed','Cash On Delivery', 'Proccessing', 'Out for Delivery', 'Delivered', 'Cancelled']
    },
    orderedBy:{type:ObjectId, ref:'User'},
    paymentIntent:{}
}, {timestamps:true})

module.exports = mongoose.model('Order', orderSchema)