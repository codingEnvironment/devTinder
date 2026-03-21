const express = require("express");
const router = express.Router();
const userAuth = require("../middleware/userAuth");
const ConnectionRequestModel = require("../models/connectionRequest");
const userData = "firstName lastName _id";

// Get all received connection requests
router.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const toUserId = req.user._id;
        const connectionRequests = await ConnectionRequestModel.find({
            toUserId,
            status: "interested"
        }).populate('fromUserId', userData) // Populate the fromUserId field with user details
        // .populate('toUserId', userData) // Optionally populate the toUserId field as well

        res.status(200).json({ 
            message: "Data fetched successfully",
            data: connectionRequests
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch requests, Err: " + error.message });
    }
});

module.exports = router;
