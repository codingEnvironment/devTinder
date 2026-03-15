const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

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
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
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
}, { timestamps: true });

// make sure to use function keyword instead of arrow function to access 'this' keyword
// these should be added before creating the model
userSchema.methods.getJwtToken = async function() {
    const token = await jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
}

const User = mongoose.model('User', userSchema);

module.exports = User;