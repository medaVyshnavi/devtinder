const mongoose = require("mongoose");

const MessagesSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref:"User"
  },
  text: {
    type: String,
    required:true
  }
})

const ChatSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    messages: [MessagesSchema],
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model( "Chat",ChatSchema);
module.exports = Chat