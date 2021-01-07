const Product = require('../models/product')
const Cart  = require('../models/cart');
const User = require('../models/user')
const Coupon = require('../models/coupon');
const Order = require('../models/order');
const uniqid = require('uniqid')

exports.userCart = async(req, res)=>{
    const {cart} = req.body
    let products = []

    const user = await User.findOne({email:req.user.email}).exec()
    const existingCartofUser = await Cart.findOne({orderedBy: user._id}).exec()

    if(existingCartofUser){
        existingCartofUser.remove({}, (err)=>{
            if(err){
                console.log(err)
            }else{
                console.log('REMOVED OLD CART!!')
            }
        })
    }else{
        console.log('NO CART!!')
    }

    for(i=0; i<cart.length; i++){
        let object = {}
        object.product = cart[i]._id
        object.count = cart[i].count
        object.color = cart[i].color

        let {price} = await Product.findById(cart[i]._id).select('price').exec()
        object.price = price
        products.push(object)
    }

    let cartTotal = 0
    products.forEach((item)=>{
        cartTotal = Number(cartTotal + item.price *item.count)
    })

    let newCart = await new Cart({
        products,
        cartTotal,
        orderedBy:user._id
    }).save()

    res.status(200).json({ok :'true'})

}

exports.getUserCart = async(req, res)=>{
    let user = await User.findOne({email: req.user.email}).exec()
    let cart = await Cart.find({orderedBy:user._id}).populate('products.product', '_id, title brand price').exec()
    res.status(200).json(cart)
}

exports.removeUserCart = async(req, res)=>{
    let user = await User.findOne({email:req.user.email}).exec()
    let cart = await Cart.findOneAndRemove({orderedBy:user._id}).exec()

    res.status(200).json(cart)
}

exports.getAddress = async(req, res)=>{
    let user = await User.findOne({email:req.user.email}).exec()
    res.status(200).json({address : user.address})

}

exports.saveAddress = async(req, res)=>{
    let user = await User.findOneAndUpdate({email:req.user.email}, {address:req.body.address}, {new:true}).exec()
    res.status(200).json({ok:'true'})
}

exports.applyCoupon = async(req, res)=>{
    let {coupon} = req.body

    let isCouponAvailable = await Coupon.findOne({name:coupon}).exec()
    console.log('COUPON>>>>>>', isCouponAvailable)

    if(isCouponAvailable === null){
        res.status(400).json({err:'INVALID COUPON'})
    }else{
        let {discount} = isCouponAvailable
        let user = await User.findOne({email:req.user.email}).exec()
        let cart = await Cart.findOne({orderedBy:user._id}).populate('products.product', '_id title price')
        let {cartTotal} = cart
        let discountGiven = (discount * cartTotal) / 100
        let totalAfterDiscount = (cartTotal - (cartTotal * discount) / 100).toFixed(2)
        console.log('TOTAL AFTER DISCOUNT>>>', totalAfterDiscount)
        await Cart.findOneAndUpdate({orderedBy:user._id}, {totalAfterDiscount}, {new:true}).exec((err, result)=>{
            if(err){
                console.log(err)
            }else{
                console.log('RESULT>>>', result)
                res.status(200).json({totalAfterDiscount, discountGiven})
            }
        })
    }
}

exports.getOrder = async(req, res)=>{
    try{
        let user = await User.findOne({email:req.user.email}).exec()
        let order = await Order.find({orderedBy:user._id}).populate('products.product').exec()
        res.status(200).json(order)
    }catch(err){
        res.status(400).json(err.message)
    }
}

exports.createOrder = async(req, res)=>{
    let {stripeResponse} = req.body

    let user = await User.findOne({email:req.user.email}).exec()
    let {products} = await Cart.findOne({orderedBy:user._id}).exec()

    let newOrder = await new Order({products, orderedBy:user._id, paymentIntent:stripeResponse}).save()

    let bulkOption = products.map((item)=>{
        return {
            updateOne:{
                filter:{_id:item.product._id},
                update: {$inc: {quantity: -item.count, sold: +item.count}}
            }
        }
    })

    let updated = await Product.bulkWrite(bulkOption, {})
    console.log('NEW ORDER', newOrder)
    res.status(200).json({ok:true})
}


//COD
exports.createOrderWithCod = async(req, res)=>{
    const {couponApplied} = req.body
    let user =await User.findOne({email:req.user.email}).exec()
    let userCart = await Cart.findOne({orderedBy:user._id}).exec()
    let finalAmount = 0

    if(couponApplied){
        finalAmount = finalAmount + userCart.totalAfterDiscount * 100
    }else{
        finalAmount = finalAmount + userCart.cartTotal * 100
    }

    const paymentIntent = {
        id:uniqid(),
        amount:finalAmount,
        currency:'inr',
        payment_method_types:['cash on deleivery'],
        status:'Cash On Delivery',
        created: new Date()
    }
    console.log(paymentIntent)

    let newOrder = await new Order({
        products:userCart.products,
        orderedBy:user._id,
        orderStatus:'Cash On Delivery',
        paymentIntent
    }).save()
    let bulkOption = userCart.products.map((item)=>{
        return {
            updateOne:{
                filter:{_id:item.product._id},
                update: {$inc: {quantity: -item.count, sold: +item.count}}
            }
        }
    })

    let updated = await Product.bulkWrite(bulkOption, {})
    console.log('NEW ORDER', newOrder)
    res.status(200).json(newOrder)
}

//WISHLIST
exports.addToWishlist = async(req, res)=>{
    try {
        const {productId} = req.body;
        let user = await User.findOneAndUpdate({email:req.user.email}, {$addToSet: {wishlist: productId}}, {new:true}).exec()
        res.status(200).json({ok : true})
    } catch (error) {
        res.status(400).json(error.message)
    }
}

exports.wishlist = async(req, res)=>{
    try {
        let products = await User.findOne({email:req.user.email}).select('wishlist').populate('wishlist').exec()
        res.status(200).json(products) 
    } catch (error) {
        res.status(400).json(error.message)
    }
}

exports.removeWishlist = async(req, res)=>{
    try {
        const {id} =req.params
        await User.findOneAndUpdate({email:req.user.email}, {$pull: {wishlist : id}}, {new:true})
        res.status(200).json({ok:true})
    } catch (error) {
        res.status(400).json(error.message)
    }
}