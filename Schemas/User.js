const mongoose = require('mongoose');

const User = mongoose.Schema (
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        email: {
            type: String                   
        }
    },
    { timestamps: true }
);

module.exports = User;