const express = require('express');
const router = express.Router();
const Blog = require('../models/blog');
const Search = require('../models/search');

const Review = require('../models/review');
const Trending = require('../models/trending');
const TrendingTag = require('../models/trendingTag');
const TrendingWriter = require('../models/trendingWriter');
const { isLoggedIn ,isSameUserBlog} = require('../middleware');




router.put('/admin/updateTrending',isLoggedIn,isAdmin,async(req, res) => {
    try {

        var num = currDate.getDate();
        var lastDay = num-req.body.nd
       await Trending.findAndDelete({day:{$lt:lAstDay}});

    }
    catch (e) {
        // console.log(e.message);
        req.flash('error', 'Some problem');
        res.redirect('/error');
    }
});
