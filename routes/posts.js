const express = require('express')
const router = express.Router();
const catchAsync = require('../functions/catchAsync')
const flash = require('connect-flash')
const passport = require('passport')
const User = require('../models/users')
const Crypto = require('../models/cryptos')
const Post = require('../models/posts')

const { isLoggedIn } = require('../functions/middleware')

// Get requests

// Create Post Page
router.get('/createPost', isLoggedIn, (req, res) => {
    res.render('posts/createPost')
})
//

// Post Page
router.get('/post/:id', catchAsync(async(req, res) => {
    const { id } = req.params;
    const post = await Post.findById(id).populate('user')
    res.render('posts/post', { post }) 
}))
//

// Update Post Page
router.get('/post/:id/update', catchAsync(async(req, res) => {
    const { id } = req.params;
    const post = await Post.findById(id).populate('user')
    res.render('posts/postUpdate', { post }) 
}))
//

// Creates Post
router.post('/newPost', catchAsync(async (req, res) => {
    const currentUser = req.user;
    const user = await User.findById(currentUser._id);
    const newPost = new Post(req.body)
    await user.posts.push(newPost)
    newPost.user = user
    await user.save()
    await newPost.save()
    res.redirect('/c')
}))
//

// Edits Post
router.put('/editPost/:id', catchAsync(async (req, res) => {
    const { id } = req.params
    const post = await Post.findByIdAndUpdate(id, req.body, { runValidators: true})
    res.redirect(`/post/${id}/update`)
}))
//

// Deletes post
router.delete('/deletePost/:id', catchAsync(async ( req, res) => {
    const { id } = req.params;
    const post = await Post.findByIdAndDelete(id)
    req.flash('success', 'Post Deleted')
    res.redirect('/currentUser')
}))
//

module.exports = router;


