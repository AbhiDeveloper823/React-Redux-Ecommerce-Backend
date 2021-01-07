const express = require('express');
const router = express.Router();

const {authCheck, adminCheck} = require('../middlewares/auth');
const {uploadImage, removeImage} = require('../controllers/cloudinary')

router.post('/uploadimages', authCheck, adminCheck, uploadImage);
router.post('/removeImages', authCheck, adminCheck, removeImage);

module.exports = router;