
const Blog = require('./models/blog');
const User = require('./models/user');
const Trending = require('./models/trending');
const TrendingTag = require('./models/trendingTag');
const TrendingWriter = require('./models/trendingWriter');
const { findByIdAndDelete } = require('./models/blog');

const getTrendingBlogs = async()=>{
    var allTrending =await Trending.find({});
    var data={};
    for(var trending of allTrending)
    {   // console.log(typeof(trending.hit));
        if(data[trending.blogTrend])
        {
            data[trending.blogTrend]=data[trending.blogTrend]+trending.hit; 
        }
        else
        {
        data[trending.blogTrend]=trending.hit; }
    }
    var trendings = Object.entries(data).map((e) => ( {['id']:e[0],hit:e[1]} ));
    trendings.sort(function(a, b){ return b['hit'] - a['hit'] });
    var mxLen = Math.min(4,trendings.length);
    trendings= trendings.splice(0,mxLen);
    console.log(`hi my length ${trendings.length}`)
    trendingsData =[];
    for(let tnd of trendings)
    {
    var obj = await Blog.findById(tnd['id']);
    trendingsData.push(obj);
    }
    
    console.log(`hi my length noe ${trendingsData.length}`)
 global.trendings= trendingsData;   
 console.log("updated");
};

const getTrendingTags = async()=>{
trendingTags = await TrendingTag.find({});
var data={};
for(var trending of trendingTags)
{  
    if(data[trending.tag])
    {
        data[trending.tag]=data[trending.tag]+trending.hit; 
    }
    else
    {
    data[trending.tag]=trending.hit; }
}
console.log(data);
var trendings = Object.entries(data).map((e) => ( {['tag']:e[0],hit:e[1]} ));
console.log(trendings);
trendings.sort(function(a,b){ return b['hit'] - a['hit'] });
var mxLen = Math.min(10,trendings.length);
trendings= trendings.splice(0,mxLen);
global.trendingTags= trendings;    
console.log("updated");   
}

const getTrendingWriters = async()=>{
    var allTrending =await TrendingWriter.find({});   
    var data={};
    for(var trending of allTrending)
    {    console.log(typeof(trending.hit));
        if(data[trending.user])
        {
            data[trending.user]=data[trending.user]+trending.hit; 
        }
        else
        {
        data[trending.user]=trending.hit; }
    }
    var trendings = Object.entries(data).map((e) => ( {['id']:e[0],hit:e[1]} ));
    trendings.sort(function(a, b){ return b['hit'] - a['hit'] });
    var mxLen = Math.min(5,trendings.length);
    trendings= trendings.splice(0,mxLen);
 trendingsData =[];
    for(let tnd of trendings)
    {
    var obj = await User.findById(tnd['id']);
    trendingsData.push(obj);
    }
    global.trendingWriters= trendingsData;   
    console.log("updated");

}

const getAllTrendings =()=>{
    getTrendingBlogs().then(()=>{
    getTrendingTags(); }).then(()=>{
    getTrendingWriters();})
}

getAllTrendings();

const update=()=>{
    var min=60000
    var time=10*min;
    setInterval(getAllTrendings,time); 
   
}
var days=86400000;

const deleteTrendingOldBlogs = async()=>{
    var currDate =new Date();
    currDate.setHours(0, 0, 0, 0);
    minDate = currDate.getTime()-5*days;
    var trendings = await Trending.find({})

    for(let trnd of trendings)
    {
        if(trnd.day.getTime()<=minDate)
        {
            await Trending.findByIdAndDelete(trnd._id);
            console.log("deleting");
        }
    }
}
const deleteTrendingOldTags = async()=>{
    var currDate =new Date();
    currDate.setHours(0, 0, 0, 0);
    minDate = currDate.getTime()-5*days;
    var trendings = await TrendingTag.find({})

    for(let trnd of trendings)
    {
        if(trnd.day.getTime()<=minDate)
        {
            await TrendingTag.findByIdAndDelete(trnd._id);
            console.log("deleting");
        }
    }
}

const deleteTrendingOldWriters = async()=>{
    var currDate =new Date();
    currDate.setHours(0, 0, 0, 0);
    minDate = currDate.getTime()-5*days;
    var trendings = await TrendingWriter.find({})

    for(let trnd of trendings)
    {
        if(trnd.day.getTime()<=minDate)
        {
            await TrendingWriter.findByIdAndDelete(trnd._id);
            console.log("deleting");
        }
    }
}

const deleteAllOldTrendings =()=>{
    deleteTrendingOldBlogs().then(()=>{
        deleteTrendingOldTags();}).then(()=>{
        deleteTrendingOldWriters();})

}



deleteAllOldTrendings();
const deleteOld= ()=>{
    
    var time=1*days;
    setInterval(deleteAllOldTrendings,time); 
}
  module.exports = {
    update,deleteOld
  }