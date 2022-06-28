const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required!']
    },
    email: {
        type: String,
        required: [true, 'Email is required!']
    },
    zipcode: {
        type: String,
        required: [true, 'Zipcode is required!']
    },
    dob: {
        type: String,
        required: [true, 'Date of birthday is required!']
    },
    headline: {
        type: String,
    },
    avatar: {
        type: String,
    },
    followings: {
        type: Array
    }
})

module.exports = profileSchema;