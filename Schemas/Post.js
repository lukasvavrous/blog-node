const mongoose = require('mongoose');

const Post = mongoose.Schema (
    {
        author: String,
        title: String,
        content: String
    },
    { timestamps: true }
);

module.exports = Post;