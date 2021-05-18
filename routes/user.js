const express = require('express');
const router = express.Router();

const User = require('../models/user');
const fs = require('fs');
const upload = require('../controllers/multer')
const cloudinary = require('../controllers/cloudinaryv2')
const { isLoggedIn ,isSameUserBlog} = require('../middleware');


router.post("/upload-profilePic",isLoggedIn,upload.single('profilePics'),async(req,res)=>{

    
        const {path} = req.file;
        try {
            let user = await User.findById(req.user._id);

            // Delete image from cloudinary
            if(user.profilePic.cid!='0')
            {
            await cloudinary.uploader.destroy(user.profilePic.cid);
            }
            // Upload image to cloudinary
            const result = await cloudinary.uploader.upload(req.file.path);


            user.profilePic.url= result.secure_url || user.profilePic.url
            user.profilePic.cid=result.public_id || user.profilePic.cid
            await user.save();
            fs.unlinkSync(path); 
            req.flash('success', 'Profile pic updated Successfully');  
            res.status(200).send({"code":"ok"});
            }
        
            catch(e) {
                console.log(e.message);
                req.flash('error', 'Cannot upload Profile pic,Something is Wrong');
                res.render('error');
            }
         
   
})


router.get('/myprofile',isLoggedIn, async(req, res) => {

    var user = await User.findById(req.user._id).populate('myblogs');

    res.render('user/myprofile',{user});

})


router.get("/publicProfile/:user",async(req,res)=>{

    var user = await User.findById(req.params.user).populate('myblogs');

    res.render('user/publicProfile',{user});

})

module.exports=router;