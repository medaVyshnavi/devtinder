const express = require("express");
const userRouter = express.Router();
const { userAuthentication } = require("../middlewares/auth")
const {ConnectionRequest} = require("../models/connectionRequestSchema")

userRouter.get("/requests/received", userAuthentication, async (req, res) => {
  try {
    const loggedInUser = req.user
    const requestList = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", ["firstName", "lastName"]);
    return res.status(200).json({message:"Fetched data Sucessfully", data: requestList})
    
  } catch (error) {
    return res.status(400).json({message:error.message})
  }
});

userRouter.get("/connections", userAuthentication, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionList = await ConnectionRequest.find({
      $or: [
        { status: "accepted", fromUserId: loggedInUser._id },
        { status: "accepted", toUserId: loggedInUser._id }]
    })
      .populate("fromUserId", ["firstName", "lastName"])
      .populate("toUserId", ["firstName", "lastName"]);

    if (!connectionList) {
      throw new Error("No connections found. You can start by sending requests to people")
    }

    const data = connectionList.map(item => {
      if (item.fromUserId._id.equals(loggedInUser._id)) {
        return item.toUserId;
      } else {
        return item.fromUserId
      }
    })

    return res
      .status(200)
      .json({ message: "Connections Fetched successfully", data });
    
  } catch (error) {
    res.status(400).send({message:error})
  }
});

module.exports = userRouter