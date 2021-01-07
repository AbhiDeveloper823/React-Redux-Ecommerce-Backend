const User = require('../models/user')
const Cart = require('../models/cart')
const Product = require('../models/product')
const Coupon = require('../models/coupon')
const stripe = require('stripe')(process.env.STRIPE_SECRET)

exports.createPaymentIntent = async(req, res)=>{
    const {couponApplied} = req.body
    console.log('COUPON APPLIED>>>', couponApplied)
    const user = await User.findOne({email:req.user.email}).exec()
    const cart = await Cart.findOne({orderedBy:user._id}).exec()
    console.log('CART', cart)
    let finalAmount = 0
    
    if(couponApplied){
        finalAmount = cart.totalAfterDiscount * 100
    }else{
        finalAmount = cart.cartTotal * 100
    }

    console.log('FINAL AMOUNT>>> ', finalAmount)

    const paymentIntent  = await stripe.paymentIntents.create({
        amount:finalAmount,
        currency: 'inr',
        description:'payment'
    })


    res.send({
        clientSecret : paymentIntent.client_secret
    })
}