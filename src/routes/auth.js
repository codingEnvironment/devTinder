const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const User = require('../models/userModel');

router.post('/signup', async (req, res) => {
    try {
        const { firstName, lastName, email, password, gender } = req.body;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const data = {
            firstName,
            lastName,
            email,
            password: hashedPassword,
            gender
        }
        await new User(data).save();
        res.send('User signed up successfully');
    } catch (err) {
        console.log('Error during signup:', err);
        res.status(500).send(err.message || 'Internal Server Error');
    }
});
router.post('/login', async (req, res) => {
    /**
     * validate email and password ****
     * check email exists in database or not
     * if email exists then validate the password using bcrypt
     * if password is valid then create a token using jwt and send it to client in cookie
     */
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).send('Invalid email or password');
        }
        // validated the password using bcrypt
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send('Invalid email or password');
        }
        // create a token using jwt and send it to client in cookie
        const token = await user.getJwtToken();
        res.cookie('token', token, { httpOnly: true });
        res.send(user);
    } catch (err) {
        console.log('Error during login:', err);
        res.status(500).send(err.message || 'Internal Server Error');
    }
});
router.post("/logout", (req, res) => {
    res.clearCookie('token');
    res.send('Logout successful');
})

module.exports = router;