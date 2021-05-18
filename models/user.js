const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique:true
    },
    myblogs:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Blog'
        }
    ],
    profilePic: {
        url:{ type: String,default:'https://cdn.pixabay.com/photo/2016/11/18/23/38/child-1837375_960_720.png'},
        cid:{type:String,default:'0'}
    },

})

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);

module.exports = User;