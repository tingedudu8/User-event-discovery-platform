const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    userId: {
        type: Number,
    },
    username: {
        type: String,
        required: [true, 'Username is required!']
    },
    id: {
        type: Number,
        required: [true, 'Post id is required!']
    },
    title: {
        type: String
    },
    body: {
        type: String
    },
    timestamp: {
        type: String
    },
    picture: {
        type: String
    },
    comments: [{
        cid: Number,
        ctext: String
    }]
})

module.exports = articleSchema;