const Product = require('../models/product')
const User = require('../models/user')
const slugify = require('slugify')

exports.listProduct = async(req, res)=>{
    await Product.find({})
    .limit(parseInt(req.params.count))
    .sort({'createdAt': -1})
    .populate('category')
    .populate('subs')
    .then((result)=>{
        res.status(200).json(result)
    }).catch((err)=>{
        res.status(400).json(err);
    })
}

exports.createProduct = async(req, res)=>{
    try{
        console.log(req.body)
        let {title} = req.body;
        req.body.slug = slugify(title);
        const newProduct = await new Product(req.body).save()
        res.status(200).json(newProduct)
    }catch(err){
        console.log(err)
        res.status(400).json({'error': err.message})
    }
}

exports.removeProduct = async(req, res)=>{
    await Product.findOneAndRemove({slug:req.params.slug}).then(()=>{
        res.status(200).json({
            'success':'Deleted!!'
        }).catch((err)=>{
            res.status(400).json({
                'error':err.message
            })
        })
    })
}

exports.getProduct=async(req, res)=>{
    console.log(req.params.slug)
    await Product.findOne({slug: req.params.slug})
    .populate('category')
    .populate('subs')
    .then((result)=>{
        res.status(200).json(result)
    }).catch((err)=>{
        res.status(400).json({'error': err.message})
    })
}

exports.updateProduct = async(req, res)=>{
    req.body.slug = slugify(req.body.title)
    await Product.findOneAndUpdate({slug:req.params.slug}, req.body, {new:true}).then((result)=>{
        res.status(200).json(result)
    }).catch((err)=>{
        res.status(400).json({'error': err.message})
    })
}

// exports.list = async(req, res)=>{
//     try{
//         const {sort, order, limit} = req.body;
//         let product = await Product.find({}).populate('category').populate('subs').sort([[sort, order]]).limit(limit).exec()
//         res.status(200).json(product)
//     }catch(err){
//         res.status(400).json(err);
//     }
   
// }

//WITH PAGINATION
exports.list = async(req, res)=>{
    let {sort, order, page} = req.body;
    let currentPage = page || 1;
    let perPage = 3;
    try {
        let product = await Product.find({})
        .skip((currentPage - 1) * perPage)
        .populate('category')
        .populate('subs')
        .sort([[sort, order]])
        .limit(perPage)

        res.status(200).json(product);
    } catch (error) {
        res.status(400).json(error)
    }
}

exports.getProductCount = async(req, res)=>{
    try {
        let total = await Product.find({}).estimatedDocumentCount().exec()
        res.status(200).json(total)
    } catch (error) {
        res.status(400).json(error)
    }
}


//STAR RATING 
exports.rateProducts =async(req, res)=>{
    let {star} = req.body;
    const product = await Product.findById(req.params.productId).exec();
    const user = await User.find({email:req.user.email}).exec();

    const existingRateObj = product.ratings.find((ele)=>(ele.postedBy).toString() === (user[0]._id).toString())
    console.log('EXISTING RATING>>>', existingRateObj)

    if(existingRateObj === undefined){
        let newRate = await Product.findByIdAndUpdate(req.params.productId, {
            $push: {ratings:{star, postedBy:user[0]._id}}
        }, {new:true})

        res.status(200).json(newRate)
    }else{
        let updateRate = await Product.updateOne(
            {ratings:{$elemMatch : existingRateObj}},
            {$set: {'ratings.$.star':star}},
            {new:true}
        )
        res.status(200).json(updateRate)
    }
}

exports.listRelatedProduct = async(req, res)=>{
    let product = await Product.findById(req.params.productId).exec()
    let related = await Product.find({
        _id:{$ne: product._id},
        category: product.category
    }).populate('category').populate('subs').limit(3).exec()
    res.status(200).json(related)
}

//FILTERS

const handleQuery = async(req, res, query)=>{
    console.log(query)
    const products =await Product.find({ $text: {$search : query}}).populate('category').populate('subs').populate('postedBy').exec();
    res.json(products)
}

const handlePrice= async(req, res, price)=>{
    try{
        const products = await Product.find({price: {$gte : price[0], $lte: price[1]}}).populate('category').populate('subs').populate('postedBy').exec();
        res.status(200).json(products)
    }catch(err){
        res.status(400).json(err.message)
    }
   
}

const handleCategory=async(req, res, category)=>{
    try {
        const products = await Product.find({category}).populate('category').populate('subs').populate('postedBy').exec()
        res.status(200).json(products)
    } catch (error) {
        res.status(400).json(error.message)
    }
}

const handleStar = async(req, res, stars)=>{
    Product.aggregate([{
        $project:{
            document: '$$ROOT',
            floorAvg: {
                $floor: { $avg: '$ratings.star' }
            }
        }
    }, {$match: {floorAvg : stars}}]).limit(9).exec((err, aggregate)=>{
        console.log('AGREEDATE>>>', aggregate)
        if(err) console.log(err);
        Product.find({_id : aggregate}).populate('category').populate('subs').populate('postedBy').exec((err, products)=>{
            if(err){
                console.log(err)
            }else{
                res.status(200).json(products)
            }
        })
    })
}

const handleSub=async(req, res, sub)=>{
    try {
        const products = await Product.find({subs:sub}).populate('category').populate('subs').populate('postedBy').exec()
        res.status(200).json(products)
    } catch (error) {
        res.status(400).json(error.message)
    }   
}

const handleBrand=async(req, res, brand)=>{
    try {
        const products = await Product.find({brand}).populate('category').populate('subs').populate('postedBy').exec()
        res.status(200).json(products)
    } catch (error) {
        res.status(400).json(error.message)
    }
}

const handleColor =async(req, res, color)=>{
    const products = await Product.find({color}).populate('category').populate('subs').populate('postedBy').exec()
    res.status(200).json(products)
}
const handleShipping =async(req, res, shipping)=>{
    const products = await Product.find({shipping}).populate('category').populate('subs').populate('postedBy').exec()
    res.status(200).json(products)
}

exports.searchFilters = async(req, res)=>{
    let {query, price, category,stars,sub,brand, color, shipping} = req.body;
    if(query){
        await handleQuery(req, res, query)
    }
    if(price){
        await handlePrice(req, res, price)
    }
    if(category){
        await handleCategory(req, res, category)
    }
    if(stars){
        await handleStar(req, res, stars)
    }
    if(sub){
        await handleSub(req, res, sub)
    }
    if(brand){
        await handleBrand(req, res, brand)
    }
    if(color){
        await handleColor(req, res, color)
    }
    if(shipping){
        await handleShipping(req, res, shipping)
    }
}