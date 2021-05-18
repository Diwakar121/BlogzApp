const express = require('express');
const router = express.Router();
const Blog = require('../models/blog');
const Search = require('../models/search');
const User = require('../models/user');
const Review = require('../models/review');
const Trending = require('../models/trending');
const TrendingTag = require('../models/trendingTag');
const TrendingWriter = require('../models/trendingWriter');
const fs = require('fs');
const upload = require('../controllers/multer')
const cloudinary = require('../controllers/cloudinary')
const { isLoggedIn ,isSameUserBlog} = require('../middleware');




router.get('/blogs', async(req, res) => {
    try {
            var trendings = global.trendings;
            var trendingTags= global.trendingTags;
            var trendingWriters=global.trendingWriters;
            console.log(trendings);
            console.log(trendingTags);
            console.log(trendingWriters);
    
    const blogs=await Blog.find({});

    res.render('blogs/app',{blogs,trendings,trendingTags,trendingWriters});

    }
    catch(e){
        console.log("Something Went Wrong");
        req.flash('error', 'Cannot Find blogs');
        res.render('error');
    }
})


// Get the form for new blog
router.get('/blogs/new',isLoggedIn, (req, res) => {

    res.render('blogs/new');
})


// create new blogs
router.post('/blogs',isLoggedIn,upload.array('image'), async(req,res)=>{
    const uploader =async (path) => await cloudinary.uploads(path,'Images')
    console.log("here finall")
    console.log(JSON.parse(req.body.extra));

const reqObj = JSON.parse(req.body.extra);

    const images =[];
    const files = req.files
    const coverImg={}
    

    var i=0;
    var indx=0;
    for(let file of files)
    {    
        if(i== 0 && reqObj.imgCoverPresent=='true')
        {
        const {path} = files[0]
        const newPath = await uploader(path)
        coverImg.url=newPath.url;
        coverImg.cid=newPath.id;

        fs.unlinkSync(path);
        i+=1;
            continue;
        }

        const {path} = file
        const newPath = await uploader(path)
        var nwobj ={};
        nwobj.url =newPath.url;
        nwobj.id=newPath.id;
        nwobj.pos=reqObj.images[indx].pos;

        images.push(nwobj);

        fs.unlinkSync(path);
        indx+=1;
        i+=1;
    }


    try {
       
var blogBody = {user: req.user._id,title:reqObj.title,imgCover:coverImg,desc:reqObj.desc,images:images,texts:reqObj.texts,reviews:reqObj.reviews,tags:reqObj.tags }
        console.log(blogBody);
    var id;
  await Blog.create(blogBody).then(savedDoc => id=savedDoc.id); 
    var user = await User.findById(req.user._id);
    console.log(user);
        user.myblogs.push(id);
        user.save();

    console.log(user);

    for( var tg  of blogBody.tags)
    {
   
        var obj= await Search.findOne({tag:tg})
      
        if(obj==undefined)
        {
            var ar=[];
            ar.push(id);
            await Search.create({tag:tg,links:ar});
        }
        else
        {
            
            obj.links.push(id);
          
            obj.save();
        }
        
    }

    
    req.flash('success', 'blog Created Successfully');  
    res.status(200).send({"code":"ok"});
    }

    catch(e) {
        console.log(e.message);
        req.flash('error', 'Cannot Create blogs,Something is Wrong');
        res.render('error');
    }
});




// edit changes to a particular blog
router.put('/blogs/:id',isLoggedIn,isSameUserBlog,async(req, res) => {
    try {
    await Blog.findByIdAndUpdate(req.params.id, req.body.blog);  

    req.flash('success', 'blog edited Successfully');  
    res.status(200).send({"code":"ok"});
    }
    catch(e){
        console.log(e);
        req.flash('error', 'Cannot make updates');
        res.redirect('/error');
    }
});


// get the edit form for blogs

router.get('/blogs/:id/edit',isLoggedIn,isSameUserBlog, async(req, res) => {
    try{
        console.log(req.blog);
    // const blog=await Blog.findById(req.params.id);
    res.render('blogs/edit',{blog:req.blog});
    }
    catch (e) {
        console.log(e.message);
        req.flash('error', 'Cannot Edit this blog');
        res.redirect('/error');
    }

})


/////////////////////////////////////////////////////////////////////////////////////////////////////////////
const updateTrending = async(req,currDate)=>{

    
    var trnd = await Trending.findOne({day:currDate,blogTrend:req.params.id})
    if(trnd==undefined)
    {
       console.log("not found"); 
       await Trending.create({day:currDate,blogTrend:req.params.id,hit:1});
       
    }
    else
    {   console.log(trnd);
        var nwhit=trnd.hit+1;
      await Trending.findByIdAndUpdate(trnd._id,{hit:nwhit});  
      console.log("reached1");
    }

}

const updateTrendingTags = async(req,currDate,blog)=>{
    
    for(let getTag of blog.tags)
    {
        var trndTag = await TrendingTag.findOne({day:currDate,tag:getTag});

         if(trndTag==undefined)
         {
            await TrendingTag.create({day:currDate,tag:getTag,hit:1});
            console.log("created");
         }
         else
         {
            await TrendingTag.findByIdAndUpdate(trndTag._id,{day:currDate,tag:getTag,hit:trndTag.hit+1});
             console.log("reached2");
         }

    }

}


const updateTrendingWriters = async(req,currDate,blog)=>{
    var trndWriter = await TrendingWriter.findOne({day:currDate,user:blog.user._id})
    if(trndWriter==undefined)
    {
       console.log("not found"); 
       await TrendingWriter.create({day:currDate,user:blog.user._id,hit:1});
       console.log(currDate);
    }
    else
    {   
        var nwhit=trndWriter.hit+1;
      await TrendingWriter.findByIdAndUpdate(trndWriter._id,{hit:nwhit});  
     console.log("reached3");
    } 

}



//get a particular blog
router.get('/blogs/:id', async(req, res) => {
  try{
    const blog=await  Blog.findById(req.params.id).populate('reviews').populate('user');
    var currDate =new Date();
    currDate.setHours(0, 0, 0, 0);
    await updateTrending(req,currDate);
    await updateTrendingTags(req,currDate,blog);
    await updateTrendingWriters(req,currDate,blog);

   res.render('blogs/show',{blog});

    } 
    catch(e) 
    {    // console.log(e.message);
        req.flash('error', 'Cannot find this Blog');
        res.redirect('/error');
    }
})

router.get('/blogs',async(req, res) => {

  
        const blogs=await Blog.find({});
    
        res.render('blogs/app',{blogs});
});




// Delete a particular blog
router.delete('/blogs/:id',isLoggedIn,isSameUserBlog, async (req, res) => {

    try {
    await Blog.findByIdAndDelete(req.params.id);
  
    
    req.flash('success', 'Deleted the blog post successfully');
    res.redirect('/blogs');   
    }
    catch (e) {
        console.log(e.message);
        req.flash('error', 'Cannot delete this blog Post');
        res.redirect('/error');
    }

})



// Creating a New Comment on a blog

router.post('/blogs/:id/review',isLoggedIn, async (req, res) => {
    
    try {
        // console.log("receved");
        const blog = await Blog.findById(req.params.id);
        const review = new Review({
            user: req.user.username,
            ...req.body
        });
        blog.reviews.push(review);

        await review.save();
        await blog.save();

        req.flash('success','Successfully added your comment!')
        res.redirect(`/blogs/${req.params.id}`);
    }
    catch (e) {
        console.log(e.message);
        req.flash('error', 'Cannot add comment to this blog');
        res.redirect('/error');
    }
    
})


router.get('/error', (req, res) => {
    res.status(404).render('error');
})


module.exports = router;