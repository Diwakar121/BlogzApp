if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');



//////////////////////////////////////////////////
const {update,deleteOld} = require('./continuous');
update();
deleteOld();
//////////////////////////////////////////////////



//models
const Blog = require('./models/blog');
const User = require('./models/user');

// Routes
const blogRoutes = require('./routes/blog');
const authRoutes =require('./routes/auth');
const searchRoutes = require('./routes/search');
const userRoutes = require('./routes/user');


app.set('view engine', 'ejs')
app.set('views',path.join(__dirname,'views'))
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json({limit:'1mb'}))
app.use(methodOverride('_method'));

const sessionConfig = {
    secret: 'itisarandomsecret123',
    resave: false,
    saveUninitialized: true
}

app.use(session(sessionConfig));
app.use(flash());



// Initilising the passport and sessions for storing the users info
app.use(passport.initialize());
app.use(passport.session());

// configuring the passport to use local strategy
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
})




mongoose.connect(process.env.DB_URL,
 {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{console.log("DB connected Sucessfully")})
.catch((e)=>{console.log("error occured");
             console.log(e.message);
});

mongoose.set('useFindAndModify',false);

app.get('/',(req,res)=>{res.render('index');})


app.use(blogRoutes);
app.use(authRoutes);
app.use(searchRoutes);
app.use(userRoutes);


app.get('*',(req,res)=>{
    res.send('<h1>Looks like you are lost ,go to </h1><a href="/">home</a>');
})


app.listen(process.env.PORT || 3000, ()=>{console.log("Server running at port 3000");})