const admin = require('../firebase/fbserver');
const User = require('../models/user')

exports.authCheck = async(req, res, next) => {
    let { authtoken } = req.headers
    await admin.auth().verifyIdToken(authtoken).then((user) => {
        req.user = user;
        console.log('AUTH CHECK COMPLETED!!')
        next();
    }).catch((err) => {
        res.status(400).json({
            'error': 'Invalid Token'
        })
    })
}

exports.adminCheck = async(req, res, next)=>{
    let {email} = req.user;
    await User.findOne({email}).then((user)=>{
        if(user.role === 'admin'){
            console.log('ADMIN CHECK COMPLETED!!')
            next();
        }
        else{
            res.json({
                'error': 'Admin Content...Unauthorized!!'
            })
        }
    }).catch((err)=>{
        res.json({
            'error': err.message
        })
    })
}