const mongoose = require('mongoose');
const Blog= require('./blog');

const searchSchema = new mongoose.Schema({
 


    tag:{
        type:String,
        required:true
    },
    links :[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Blog'
    }]


});


const Search = mongoose.model('Search',searchSchema);

module.exports = Search;