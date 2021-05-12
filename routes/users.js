const express = require('express')
const router = express.Router();
const catchAsync = require('../functions/catchAsync')
const flash = require('connect-flash')
const passport = require('passport')
const User = require('../models/users')
const Crypto = require('../models/cryptos')

const { isLoggedIn } = require('../functions/middleware')

// User get Routes

// Register User Page
router.get('/registerUser', (req, res) => {
    res.render('users/registerUser')
})
//

// All Users Page (Would be an admin page in production and have a search bar to search users)
router.get('/users', catchAsync(async(req, res) => {
    const users = await User.find({})
    res.render('users/users', { users })  
}))

// Login Page
router.get('/login', (req, res) => {
    res.render('users/login')
})
//

// Update User Page
router.get('/user/:id/update', isLoggedIn, (req, res) => {
    res.render('users/userUpdate')
})
//

// Current User Page
router.get('/currentUser', isLoggedIn, catchAsync(async (req, res) => {
    res.render('users/currentUser')
}))
//

// User Page
router.get('/userPage/:id', catchAsync(async(req, res) => {
    const { id } = req.params
    const user = await User.findById(id).populate('favoriteCryptos').populate({ path: 'posts', populate: { path: 'user'}}) // .populate('favorites')
    res.render('users/userPage', { user })
}))
//

// Create User
router.post('/newUser', catchAsync(async (req, res, next) => {
    const { userImg, username, password, age } = req.body;
    const user = new User({ userImg, username, age });
    const newUser = await User.register(user, password)
    req.login(newUser, err => {
        if (err) return next(err);
        req.flash('success', 'Welcome to Veddit');
        res.redirect('/c');
    })
}))
//

// Logout
router.post('/logout', (req, res) => {
    req.logout()
    req.flash('success', 'goodbye!')
    res.redirect('/c')
})
//

// Login
router.post('/users/login', passport.authenticate('local'), (req, res) => {
    try {
        req.flash('success', 'welcome back')
        res.redirect('/c')
    } catch (e) {
        req.flash('error', e.message)
        res.redirect('login')
    }
})
//

// Adds Favorite Crypto
router.post('/addfavorite/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    const currentUser = req.user;
    const crypto = await Crypto.findById(id);
    await currentUser.favoriteCryptos.push(crypto)
    currentUser.save()
    res.redirect('back')
}))
//

// Removes Favorite Crypto
router.put('/removeFavorite/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const currentUser = req.user;
    const crypto = await Crypto.findById(id);
    await currentUser.favoriteCryptos.splice(currentUser.favoriteCryptos.indexOf(crypto._id) , 1)
    currentUser.save()
    res.redirect('back')
}))
//

// Adds Friends
router.post('/addfriend/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    const currentUser = req.user;
    const friend = await User.findById(id);
    await currentUser.friends.push(friend)
    currentUser.save()
    res.redirect('/Users')
}))
//

// Removes Friends
router.put('/removeFriend/:id', isLoggedIn, catchAsync(async(req, res) => {
    const { id } = req.params;
    const currentUser = req.user;
    const friend = await User.findById(id)
    await currentUser.friends.splice(currentUser.friends.indexOf(friend._id) , 1)
    currentUser.save()
    res.redirect('back')
}))
//

// Updates User (Bio)
router.put('/user/:id', catchAsync(async (req, res) => {
    const { id } = req.params
    const user = await User.findByIdAndUpdate(id, req.body, { runValidators: true })
    req.flash('success', 'User Updated!')
    res.redirect(`/c`) 
}))
//

// Deletes User
router.delete('/user/:id', catchAsync(async (req, res) => {
    const { id } = req.params
    const deletedUser = await User.findByIdAndDelete(id)
    res.redirect('/c') 
}))
//

module.exports = router;
