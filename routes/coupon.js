const express = require('express');
const router = express.Router();

const {create, remove, list} = require('../controllers/coupon');

const {authCheck, adminCheck} = require('../middlewares/auth');

router.get('/coupons', list)
router.post('/coupon', authCheck,adminCheck, create)
router.delete('/coupon/:id', authCheck, adminCheck, remove)

module.exports = router;