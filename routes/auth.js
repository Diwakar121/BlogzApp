const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const { isLoggedIn } = require('../middleware');






// Get the signup form
router.get('/register', async (req, res) => {
    res.render('auth/signup');
})

router.post('/register', async (req, res) => {
    
    try {
        const user = new User({ username: req.body.username, email: req.body.email });
        const newUser = await User.register(user, req.body.password);
        req.flash('success', 'Registered Successfully');
        res.redirect('/login');
    }
    catch (e) {
        req.flash('error', e.message);
        res.redirect('/register')
    }
});


// Get the login form
router.get('/login', async (req, res) => {
    
    res.render('auth/login')
})

router.post('/login',
    passport.authenticate('local',
        {
            failureRedirect: '/login',
            failureFlash: true
        }
    ), (req, res) => {
        req.flash('success', `Welcome Back!! ${req.user.username}`)
        res.redirect('/blogs');
});


// Logout the user from the current session
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Logged Out Successfully');
    res.redirect('/login');
})




module.exports = router;