const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const posts = new Schema({
    postImg: {
        type: String,
        required: true,
    },
    postTitle: {
        type: String,
        required: true,
    },
    postDescription: {
        type: String,
        required: true,
    },
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
})

const Post = mongoose.model('Post', posts)

module.exports = Post;      