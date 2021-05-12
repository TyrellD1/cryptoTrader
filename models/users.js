const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;
const Post = require('../models/posts')

const users = new Schema({
    userImg: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
    },
    bio: {
        type: String,
        required: false,
    },
    age: {
        type: Number,
        required: true
    },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    favoriteCryptos: [{type: mongoose.Schema.Types.ObjectId, ref: 'Crypto'}],
    posts: [{type: mongoose.Schema.Types.ObjectId, ref: 'Post'}],
})

users.post('findOneAndDelete', async function (user) {
    try {
        if (user.posts.length) {
            const res = await Post.deleteMany({ _id : { $in : user.posts }} )
            console.log(res)
        }
    } catch(e) {
        console.log(e)
    }
})

users.plugin(passportLocalMongoose)

const User = mongoose.model('User', users)

module.exports = User;