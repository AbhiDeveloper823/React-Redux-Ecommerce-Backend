const Sub = require('../models/sub');
const slugify = require('slugify');
const Product = require('../models/product')
const user = require('../models/user');

exports.listSub = async(req, res)=>{
    await Sub.find({}).then((result)=>{
        res.status(200).json(result)
    }).catch((err)=>{
        res.status(400).json(err)
    })
}

exports.getSub = async(req, res)=>{
    const {slug} = req.params;
    let sub  = await Sub.findOne({slug}).exec()
    let products = await Product.find({subs: sub}).exec()
    res.status(200).json({sub, products})
}

exports.createSub = async(req, res)=>{
    try{
        const {name, parent} = req.body
        res.status(200).json(await new Sub({name,parent, slug:slugify(name)}).save())
    }catch(err){
        res.status(400).json({'error':`Error Occured WHile Creating ..... ${err.message}`})
    }
}

exports.updateSub=async(req, res)=>{
    const {slug} = req.params
    const {name, parent} = req.body
    await Sub.findOneAndUpdate({slug}, {name,parent, slug:slugify(name)}, {new:true}).then((result)=>{
        res.status(200).json(result)
    }).catch((err)=>{
        res.status(400).json({'error':`Error Occured WHile Updating ${slug} ..... ${err.message}`})
    })
}

exports.removeSub=async(req, res)=>{
    const {slug} = req.params
    await Sub.findOneAndRemove({slug}).then((result)=>{
        res.status(200).json({'success': `Deleted ${slug}`})
    }).catch((err)=>{
        res.status(400).json({'error':`Error Occured WHile Deleting ${slug} ..... ${err.message}`})
    })
}