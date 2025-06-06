const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
  fromUserId: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
  },
  toUserId: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
  },
  status: {
    type: String,
    require :true,
    enum: {
      values: ["ignore", "interested", "accepted", "rejected"],
      message: `{VALUE} is not an accepted value`,
    },
  },
}, {
  timestamps : true
});

connectionRequestSchema.pre("save", function (next) {
  if (this.fromUserId === this.toUserId) {
    throw new Error("Cannot send request to yourself")
  }
  next();
})

const ConnectionRequest = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = { ConnectionRequest };