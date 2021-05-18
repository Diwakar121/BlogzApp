const mongoose = require('mongoose');

const trendingSchema = new mongoose.Schema({
 
    day:{type:Date},
    hit:{type:Number, default:0},
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User' 
    } 
});


const TrendingWriter = mongoose.model('TrendingWriter',trendingSchema);

module.exports = TrendingWriter;