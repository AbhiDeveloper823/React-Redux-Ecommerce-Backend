const express = require('express');
const router = express.Router();

const {authCheck, adminCheck} = require('../middlewares/auth');
const {createProduct, listProduct, removeProduct, getProduct, getProductCount, updateProduct, list, rateProducts, listRelatedProduct, listCategoryProduct, searchFilters} = require('../controllers/product');

router.get('/product/:count', listProduct);
router.get('/product/info/:slug', getProduct)
router.post('/product', authCheck, adminCheck, createProduct)
router.put('/product/:slug', authCheck, adminCheck, updateProduct)
router.delete('/product/:slug',authCheck, adminCheck, removeProduct)

router.post('/products', list)
router.get('/products/total', getProductCount)

//ratings
router.put('/product/star/:productId', authCheck, rateProducts)

//related
router.get('/product/related/:productId', listRelatedProduct)

//filters
router.post('/search/filters', searchFilters)


module.exports = router;