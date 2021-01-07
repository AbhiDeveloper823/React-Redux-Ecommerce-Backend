const Order = require('../models/order')

exports.listOrders = async(req, res)=>{
    try {
        let orders = await Order.find({}).sort({createdAt:-1}).populate('products.product').exec()
        res.status(200).json(orders)
    } catch (error) {
        res.status(400).json(error.message)
    }
}

exports.orderStatus=async(req, res)=>{
    try {
        let {order_id, orderStatus} = req.body
        let updated = await Order.findByIdAndUpdate(order_id, {orderStatus}, {new:true}).exec()
        res.status(200).json(updated)
    } catch (error) {
        res.status(400).json(error.message)
    }
}