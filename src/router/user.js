const express = require("express");
const userRouter = express.Router();
const { userAuthentication } = require("../middlewares/auth")
const {ConnectionRequest} = require("../models/connectionRequestSchema");
const { User } = require("../models/userSchema");

userRouter.get("/requests/received", userAuthentication, async (req, res) => {
  try {
    const loggedInUser = req.user
    const requestList = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", [
      "firstName",
      "lastName",
      "age",
      "gender",
      "photoURL",
      "about",
    ]);
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
      .populate("fromUserId", ["firstName", "lastName","age","gender","photoURL","about"])
      .populate("toUserId", ["firstName", "lastName","age","gender","photoURL", "about"]);

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

// in the feed api i have to show the users which are not accepted rejected ignored 
// or intrested. so i get all those id of the users that have already one of those status 
// with loggedin user as from or to user id. then filter them all from the user list based 
// on the email id that is unique.

userRouter.get("/feed", userAuthentication, async(req, res) => {
  try {
    const page = req.query.page || 1;
    let limit = req.query.limit || 2;
    limit = limit > 50 ? 50 : limit
    const skip = (page - 1) * limit;

    const loggedInUser = req.user
    const accessedProfiles = await ConnectionRequest.find({
      $or: [
        {
          fromUserId: loggedInUser._id,
          status: { $in: ["interested", "rejected", "accepted", "ignore"] },
        },
        {
          toUserId: loggedInUser._id,
          status: { $in: ["interested", "rejected", "accepted", "ignore"] },
        },
      ],
    }).populate("fromUserId", ["email"])
      .populate("toUserId", ["email"]);
  
    
    const objectIds = accessedProfiles.map(profile => {
      if (profile.fromUserId._id.equals(loggedInUser._id)) {
        return profile.toUserId._id
      }
      return profile.fromUserId._id
    })

    objectIds.push(loggedInUser._id)

    const feedList = await User.find({ _id: { $nin: objectIds } }).select(
      "firstName lastName dob gender hobbies photoURL about"
    ).skip(skip).limit(limit);

    res.status(200).json({message : "Sucessfully Fetched the feed data", data:feedList})
    
  } catch (error) {
    res.status(400).send({message:error})
  }
})

module.exports = userRouter