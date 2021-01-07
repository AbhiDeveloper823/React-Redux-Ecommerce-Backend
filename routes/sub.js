const express = require('express');
const router = express.Router();

const {listSub, getSub, createSub, updateSub, removeSub, getSubOnParent} = require('../controllers/sub');

const {authCheck, adminCheck} = require('../middlewares/auth')

router.get('/sub', listSub);
router.get('/sub/:slug', getSub);
router.post('/sub', authCheck, adminCheck, createSub);
router.put('/sub/:slug', authCheck, adminCheck, updateSub);
router.delete('/sub/:slug', authCheck, adminCheck, removeSub);

module.exports = router;