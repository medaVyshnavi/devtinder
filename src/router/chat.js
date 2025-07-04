const express = require("express");
const chatRouter = express.Router();
const { userAuthentication } = require("../middlewares/auth");
const Chat = require("../models/ChatSchema");

chatRouter.post("/history", userAuthentication, async (req, res) => {
  const { userId, targetUserId } = req.body;
  let chatHistory = await Chat.findOne({
    participants: { $all: [userId, targetUserId] },
  });
 
  if (!chatHistory) {
    chatHistory = new Chat({
      participants: [userId, targetUserId],
      messages: [],
    });
    await chatHistory.save();
  }
  res.status(200).json({ message: "Fetched Chat History", data: chatHistory });
});

module.exports = chatRouter