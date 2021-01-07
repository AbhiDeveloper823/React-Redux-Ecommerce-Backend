const User = require('../models/user');

exports.createUser = async(req, res) => {
    const { email } = req.user
    await User.findOneAndUpdate({ email }, { email }, { new: true }).then(async(result) => {
        if (result) {
            res.json(result)
        } else {
            let newUser = await new User({ email }).save();
            res.status(200).json(newUser)
        }
    })
}

exports.currentUser = async(req, res)=>{
    const {email} = req.user;
    await User.findOne({email}).then((result)=>{
        res.status(200).json(result);
    }).catch((err)=>{
        res.status(400).json({
            'error': 'Not Found!!'
        })
    })
}