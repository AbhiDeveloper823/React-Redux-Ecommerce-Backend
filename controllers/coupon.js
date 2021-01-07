const Coupon = require('../models/coupon')

exports.create = async(req, res)=>{
    try {
        console.log(req.body)
        let {name, expiry, discount} = req.body
        res.status(200).json(await new Coupon({name, expiry, discount}).save())
    } catch (error) {
        res.status(400).json(error.message)
    }
}

exports.list = async(req, res)=>{
    try{
        let coupons = await Coupon.find({}).sort({createdAt:-1}).exec()
        res.status(200).json(coupons)
    }catch(err){
        res.status(400).json(err.message)
    }
    
}

exports.remove = async(req, res)=>{
    try{
        let {id} = req.params
        let removedCoupon = await Coupon.findByIdAndRemove(id).exec()
        res.status(200).json(removedCoupon)
    }catch(err){
        res.status(400).json(err.message)
    }
    
}