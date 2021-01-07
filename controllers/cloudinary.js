const cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
});

exports.uploadImage = async(req, res)=>{
    let result = await cloudinary.uploader.upload(req.body.images, {
        public_id:`${Date.now()}`,
        resource_type:'auto'
    });
    res.status(200).json({
        public_id: result.public_id,
        url:result.secure_url
    })
}

exports.removeImage = async(req, res)=>{
    console.log(req.body)
    let images_id = req.body.public_id;
    let result  = await cloudinary.uploader.destroy(images_id)
    res.status(200).json(result)
}