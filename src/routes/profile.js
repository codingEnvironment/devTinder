const express = require('express');
const router = express.Router();
const userAuth = require('../middleware/userAuth');
const User = require('../models/userModel');
const { validateEditProfileRequest } = require("../utils/validation")

router.get('/view', userAuth, async (req, res) => {
    /**
     * get the token from cookie
     * if token exists then verify the token using jwt
     * if token is valid then retrieve id from it
     * fetch the user details from database using id and send it to client
     */
    res.send(req.user);
});

router.patch('/edit', userAuth, async (req, res) => {
    /**
     * user can update his profile details like firstName, lastName, email, interest
     */
    try {
        const { isValid, message } = validateEditProfileRequest(req.body);

        if (!isValid) {
            return res.status(400).send(message);
        }
        // update the user details in database and send the updated details to client
        const loggedInUser = req.user;
        const { _id } = loggedInUser;
        Object.keys(req.body).forEach((key) => {
            loggedInUser[key] = req.body[key];
        });
        // await User.findByIdAndUpdate(_id, loggedInUser, { returnDocument: 'after' });
        await loggedInUser.save();
        res.send(`${loggedInUser.firstName} Profile updated successfully`);
    } catch (err) {
        console.log('Error during profile update:', err);
        res.status(500).send("ERROR: " + err.message || 'Internal Server Error');
    }

});

module.exports = router;