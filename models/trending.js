const mongoose = require('mongoose');
const Blog= require('./blog');

const trendingSchema = new mongoose.Schema({
 
    day:{type:Date},

    blogTrend:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'Blog'  
        },
    hit:{type:Number, default:0}   
        

});


const Trending = mongoose.model('Trending',trendingSchema);

module.exports = Trending;