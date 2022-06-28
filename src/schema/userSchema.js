const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required!']
    },
    salt: {
        type: String,
        required: [true, 'Salt is required!']
    },
    hash: {
        type: String,
        required: [true, 'Salted Password is required!']
    }
})

module.exports = userSchema;