const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const userAuth = async (req, res, next) => {
    try{
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).send('Unauthorized');
        }
        const decoded = jwt.verify(token, 'testinggg');
        const user = await User.findById(decoded._id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        req.user = user; // Attach user to request object
        next();
    }
    catch(err) {
        res.status(401).send('Unauthorized');
    }
}

module.exports = userAuth;