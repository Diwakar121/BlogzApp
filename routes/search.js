const express = require('express');
const router = express.Router();
const Search= require('../models/search');


router.get('/search',async(req, res) => {
    try {
       
          var srchResult=  await Search.findOne({tag:req.query.q}).populate('links');
          
          if(!srchResult)
          {
            
                 res.render('blogs/srchShow',{srchResult:{links:[]},topic:req.query.q});
          }
    
          res.render('blogs/srchShow',{srchResult,topic:req.query.q});
    
    }
    catch (e) {
      
        req.flash('error', 'Nothing mactched to your search');
        res.redirect('/error');
    }
});

module.exports = router;