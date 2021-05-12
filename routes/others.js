const express = require('express')
const router = express.Router();
const catchAsync = require('../functions/catchAsync')
const flash = require('connect-flash')
const passport = require('passport')
const User = require('../models/users')
const Crypto = require('../models/cryptos')
const Post = require('../models/posts')

const { isLoggedIn } = require('../functions/middleware')

// Home Page
router.get('/c', catchAsync(async(req, res) => {
    const posts = await Post.find({}).populate('user')
    res.render('home', { posts })
}))
//

module.exports = router;