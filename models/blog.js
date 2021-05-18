const mongoose = require('mongoose');
const Review = require('./review');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required:true
    },
    imgCover: {
        url:{ type: String},
        cid:{type:String}
    },
    
    desc: {
        type: String
    },
    images:[{ pos:{type:String} ,
        url:{type:String},
        cid:{type:String}
    }],

    texts:[{ pos:{type:Number} ,
        value:{type:String}}] ,

    reviews: [{
                type: mongoose.Schema.Types.ObjectId,
                ref:'Review'
            }],
    
    user: {
                type: mongoose.Schema.Types.ObjectId,
                ref:'User'
            },
    

    tags : [
        {
            type:String
        }
    ] 
    
    
});


const Blog = mongoose.model('Blog',blogSchema);

module.exports = Blog;