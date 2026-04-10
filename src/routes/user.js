const express = require("express");
const router = express.Router();
const userAuth = require("../middleware/userAuth");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/userModel");
const userData = "firstName lastName";

// Get all received connection requests
router.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const toUserId = req.user._id;
    const connectionRequests = await ConnectionRequestModel.find({
      toUserId,
      status: "interested",
    }).populate("fromUserId", userData); // Populate the fromUserId field with user details
    // .populate('toUserId', userData) // Optionally populate the toUserId field as well

    res.status(200).json({
      message: "Data fetched successfully",
      data: connectionRequests,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch requests, Err: " + error.message });
  }
});

// Get all connections
router.get("/user/connections", userAuth, async (req, res) => {
  try {
    /**
     * if Mahesh sent a interested request to Ramesh and Ramesh accepted it, then both Mahesh and Ramesh should see each other in their connections list.
     * To achieve this, we can query the ConnectionRequest collection for all documents where either fromUserId or toUserId matches the current user's ID and the status is "accepted".
     * This way, we can retrieve all accepted connections for the user, regardless of whether they sent or received the connection request.
     */
    const loggedInUserId = req.user._id;
    let connections = await ConnectionRequestModel.find({
      $or: [{ fromUserId: loggedInUserId }, { toUserId: loggedInUserId }],
      status: "accepted",
    })
      .populate("fromUserId", userData)
      .populate("toUserId", userData);

    connections = connections.map((connection) => {
      if (connection.fromUserId._id.toString() === loggedInUserId.toString()) {
        return connection.toUserId;
      }
      return connection.fromUserId;
    });

    res.status(200).json({
      message: "Data fetched successfully",
      data: connections,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch connections, Err: " + error.message });
  }
});

// Get feed
router.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { page, limit } = req.query;
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;

    const connections = await ConnectionRequestModel.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const usersAlreadyInNetwork = new Set();
    connections.forEach((connection) => {
      usersAlreadyInNetwork.add(connection.fromUserId.toString());
      usersAlreadyInNetwork.add(connection.toUserId.toString());
    });

    console.log(usersAlreadyInNetwork);

    /**
     * skip & limit logic
     * page: 1, limit: 10 => skip: 0, limit: 10
     * page: 2, limit: 10 => skip: 10, limit: 10
     * page: 3, limit: 10 => skip: 20, limit: 10
     * skip = (page - 1) * limit
     */

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(usersAlreadyInNetwork) } },
        { _id: { $ne: loggedInUser._id } }, // this condition not needed if the loggedin user has already connections but
        // incase if the user not have any connections,
        // then we will be getting all users in the feed, which is not expected. We should exclude the loggedin
        // user from the feed as well.
      ],
    })
      .select("firstName lastName age profilePicture bio")
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    res.status(200).json({
      message: "Data fetched successfully",
      data: users,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch feed, Err: " + error.message });
  }
});

module.exports = router;
