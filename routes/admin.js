const express = require('express');
const router = express.Router();

const {listOrders, orderStatus} = require('../controllers/admin');

const {authCheck, adminCheck} = require('../middlewares/auth');

router.get('/admin/orders',authCheck,adminCheck, listOrders);
router.put('/admin/order-status', authCheck, adminCheck, orderStatus)

module.exports = router;