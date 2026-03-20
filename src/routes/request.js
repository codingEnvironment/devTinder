const express = require("express");
const router = express.Router();
const userAuth = require("../middleware/userAuth");
const UserModel = require("../models/userModel");
const ConnectionRequestModel = require("../models/connectionRequest");

// Create a new connection request
router.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatuses = ['ignored', 'interested'];
        if (!allowedStatuses.includes(status)) {
            throw new Error("Invalid status value");
        }

        // check if the toUserId is valid and exists in the database
        const toUserData = await UserModel.findById(toUserId);
        if (!toUserData) {
            throw new Error("User not found");
        }

        // check if the fromUserId and toUserId are the same
        // this can be moved to schema validation as well
        // if (fromUserId.toString() === toUserId) {
        //     throw new Error("You cannot send a connection request to yourself");
        // }

        // check if a connection request already exists between the two users
        const existingRequest = await ConnectionRequestModel.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });
        if (existingRequest) {
            throw new Error("Connection request already exists");
        }

        const connectionRequest = new ConnectionRequestModel({
            fromUserId,
            toUserId,
            status
        });
        const savedConnectionRequest = await connectionRequest.save();
        let message = `${req.user.firstName} ${status} in ${toUserData.firstName}'s profile`;
        res.status(201).json({ message, connectionRequest: savedConnectionRequest });
    } catch (error) {
        res.status(500).json({ error: "Failed to send connection, Err: " + error.message });
    }
});

// Review connection request route skeleton
router.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try {
        const requestId = req.params.requestId;
        const status = req.params.status;
        const loggedInUser = req.user;

        const allowedStatuses = ['accepted', 'rejected'];
        if (!allowedStatuses.includes(status)) {
            throw new Error("Invalid status value");
        }

        const existingRequest = await ConnectionRequestModel.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: 'interested'
        });

        if (!existingRequest) {
            throw new Error("Connection request not found");
        }

        existingRequest.status = status;
        const updatedRequest = await existingRequest.save();

        res.status(200).json({
            message: `${loggedInUser.firstName} has ${status} the request`,
            data: updatedRequest
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to review connection, Err: " + error.message });
    }
});

module.exports = router;