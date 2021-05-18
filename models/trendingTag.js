const mongoose = require('mongoose');

const trendingSchema = new mongoose.Schema({
 
    day:{type:Date},
    hit:{type:Number, default:0},
    tag : {
        type:String
    } 
});


const TrendingTag = mongoose.model('TrendingTag',trendingSchema);

module.exports = TrendingTag;