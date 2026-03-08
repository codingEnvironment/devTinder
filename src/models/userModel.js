const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: String, // its a short hand for { type: String }
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    company: String,
    profilePicture: {
        type: String,
        default: 'https://www.deccanchronicle.com/h-upload/2025/11/15/1978625-mahesh-babu.webp'
    },
    bio: String,
    interests: [String],
    location: String,
    age: Number
});

const User = mongoose.model('User', userSchema);
module.exports = User;