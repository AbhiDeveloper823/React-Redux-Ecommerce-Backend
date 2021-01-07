const Category = require('../models/category');
const Sub  = require('../models/sub');
const Product = require('../models/product')
const slugify = require('slugify');

exports.listCategories = async(req, res)=>{
    await Category.find({}).then((result)=>{
        res.status(200).json(result)
    }).catch((err)=>{
        res.status(400).json({
            'error':err.message
        })
    })
}

exports.getCategory = async(req, res)=>{
    const {slug} = req.params;
    await Category.find({slug}).then(async(result)=>{
        let products = await Product.find({category:result}).populate('category').populate('subs').exec()
        res.status(200).json({result, products})
    }).catch((err)=>{
        res.status(400).json({
            'error': err.message
        })
    })
}

exports.createCategory = async(req, res)=>{
    try{
        const {name} = req.body
        console.log(name)
        res.json(await new Category({name, slug:slugify(name)}).save())
    }catch(err){
        console.log(err)
        res.status(400).json(err.message)
    } 
}

exports.updateCategory = async(req, res)=>{
    const {slug} = req.params
    const {name} = req.body
    await Category.findOneAndUpdate({slug}, {name, slug:slugify(name)}, {new:true}).then((result)=>{
        res.status(200).json(result);
    }).catch((err)=>{
        res.status(400).json({
            'error': err.message
        })
    })
}

exports.removeCategory = async(req, res)=>{
    const {slug} = req.params
    await Category.findOneAndRemove({slug}).then((result)=>{
        res.status(200).json({
            'success':'Deleted!!'
        }).catch((err)=>{
            res.status(400).json({
                'error':err.message
            })
        })
    })
}

exports.getCategorySub = async(req, res)=>{
    await Sub.find({parent: req.params.id}).then((result)=>{
        res.status(200).json(result)
    }).catch((err)=>{
        res.status(400).json(err.message)
    })
}