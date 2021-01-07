const express = require('express');
const router = express.Router()

const {userCart, getUserCart, removeUserCart, saveAddress, getAddress, applyCoupon, createOrder, getOrder, createOrderWithCod, addToWishlist, wishlist, removeWishlist} = require('../controllers/user');

const {authCheck} = require('../middlewares/auth');

router.post('/user/cart', authCheck, userCart)
router.get('/user/cart', authCheck, getUserCart)
router.delete('/user/cart', authCheck, removeUserCart)
router.get('/user/address', authCheck, getAddress)
router.post('/user/address', authCheck, saveAddress)
router.post('/user/cart/coupon', authCheck, applyCoupon)
router.get('/user/orders', authCheck, getOrder)
router.post('/user/order', authCheck, createOrder)

//COD
router.post('/user/order/cod', authCheck, createOrderWithCod)

//wishlist
router.post('/user/wishlist', authCheck, addToWishlist)
router.get('/user/wishlist', authCheck, wishlist)
router.put('/user/wishlist/:id', authCheck, removeWishlist)


module.exports = router