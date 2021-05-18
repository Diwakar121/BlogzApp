const Blog = require('./models/blog');


const isLoggedIn = (req,res,next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You Need To Login First');
        return res.redirect('/login');
    }
    next();
}

const isSameUserBlog  = async(req,res,next) => {
    const blog=await Blog.findById(req.params.id); 
   
    if (!blog.user.equals(req.user._id)) {
        req.flash('error', 'You Are not allowed to acess this');
       
        console.log("reaching here");
        return res.redirect('/login');
    }
    else
    {
        req.blog=blog;
    next();
    }
}

const isAdmin = (req,res,next) => {
    if (req.user.username=='admin') {
        next();
    }
    else
    {
        req.flash('error', 'This is a secure route');
        return res.redirect('/login');
    }
    next();
}

module.exports = {
    isLoggedIn,
    isSameUserBlog,
    isAdmin
}

