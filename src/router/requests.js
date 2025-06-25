const express = require("express");
const requestsRouter = express.Router();
const { userAuthentication } = require("../middlewares/auth");
const { User } = require("../models/userSchema") 
const { ConnectionRequest } = require("../models/connectionRequestSchema")
const sendEmail = require("../utils/sendEmail")

requestsRouter.post("/send/:status/:userId", userAuthentication, async (req, res) => {
  try {   
    const toReceiverId = req.params.userId;
    const status = req.params.status;
    const loggedInUser = req.user;

    const allowedStatus = ["interested", "ignore"];
    const isValidStatus = allowedStatus.includes(status);
    
    if (!isValidStatus){
      throw new Error(`${status} is an invalid status`)
    }

    const receiverData = await User.findById(toReceiverId);
    if (!receiverData) {
      throw new Error("User not found");
    }

    const duplicate = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, toUserId: receiverData._id },
        { fromUserId: receiverData._id, toReceiverId: loggedInUser._id },
      ],
    });

    if (duplicate.length > 0) {
      throw new Error("duplicate Request")
    }

    const newConnection = new ConnectionRequest({
      fromUserId: loggedInUser._id,
      toUserId: receiverData._id,
      status,
    });

    const connectionRequest = await newConnection.save();
    const emailResponse = await sendEmail.run();
    console.log(emailResponse)

    if (connectionRequest) {
      return res.status(200).json({ message: "Request sent successfully" });
    }

  } catch (error) {
    console.log(error.message);
    return res.status(400).json({message:error.message})
  }
});

requestsRouter.post("/review/:status/:requestId", userAuthentication, async (req, res) => {
  try {

    const { status, requestId } = req.params;
    const allowedStatus = ["accepted", "rejected"];
    if (!allowedStatus.includes(status)) {
      throw new Error("status is not allowed");
    }

    const loggedInUser = req.user

    const fetchDataToUpdateStatus = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: "interested",
    });

    if (!fetchDataToUpdateStatus) {
      throw new Error("connection not found");
    }

    fetchDataToUpdateStatus.status = status;
    await fetchDataToUpdateStatus.save();

    res.status(200).json({message:`${status} the connection request`})
    
  } catch (error) {
    return res.status(400).json({message:error.message})
  }
});

module.exports = requestsRouter