const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref:"User"
    },
    paymentId: {
      type: String,
    },
    orderId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    receipt: {
      type: String,
      required: true,
    },
    notes: {
      firstName: {
        type: String
      },
      lastName: {
        type: String
      },
      plan: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

const Payment = mongoose.model("payment", paymentSchema)

module.exports = {Payment}