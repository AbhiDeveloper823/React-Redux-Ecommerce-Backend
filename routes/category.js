const express = require('express');
const router = express.Router();

const {listCategories, getCategory, createCategory, updateCategory, removeCategory, getCategorySub} = require('../controllers/category');

const {authCheck, adminCheck} = require('../middlewares/auth')

router.get('/categories', listCategories);
router.get('/category/:slug', getCategory);
router.get('/category/sub/:id', getCategorySub);
router.post('/category', authCheck, adminCheck, createCategory);
router.put('/category/:slug', authCheck, adminCheck, updateCategory);
router.delete('/category/:slug', authCheck, adminCheck, removeCategory);

module.exports = router;