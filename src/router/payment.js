const express = require("express");
const { userAuthentication } = require("../middlewares/auth");
const paymentRouter = express.Router();
const rzpInstance = require("../utils/razorpay");
const { Payment } = require("../models/paymentSchema");
const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");
const { User } = require("../models/userSchema");

paymentRouter.post("/create", userAuthentication, async (req, res) => {
  try {
    const user = req.user;
    const amount = req.body.type === "gold" ? 500000 : 100000
    const rzpResponse = await rzpInstance.orders.create({
      amount: amount,
      currency: "INR",
      receipt: "receipt#1",
      partial_payment: false,
      notes: {
        firstName: user.firstName,
        lastName: user.lastName,
        email:user.email,
        membershipType: req.body.type,
      },
    });
    console.log(rzpResponse);

    // save to db
    const order = new Payment({
      userId: req.user._id,
      orderId: rzpResponse.id,
      currency: rzpResponse.currency,
      amount: rzpResponse.amount,
      receipt: rzpResponse.receipt,
      notes: rzpResponse.notes,
      status:rzpResponse.status
    })
    const dbResponse = await order.save();

    res
      .status(200)
      .json({ ...dbResponse.toJSON(), keyId: process.env.RAZORPAY_KEY });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

paymentRouter.post("/webhook", async (req, res) => {

  const webhookSignature = req.get("X-Razorpay-Signature");
  try {
    const isWebhookValid = validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      RAZORPAY_WEBHOOK_SECRET
    );

    if (!isWebhookValid) {
      res.status(400).send({ message: "Invalid webhook signature" });
    }

    // update the payment status
    const paymentDetails = req.body.payload.payment.entity;
    const payment = await Payment.findOne({
      orderId: paymentDetails.order_id
    })

    payment.status = paymentDetails.status;
    await payment.save();

    // update the user as premium and membership details
    const user = await User.findOne({ _id: payment.userId })
    user.isPremium = true;
    user.membershipType = payment.notes.membershipType
    await user.save();

    // if (req.body.event === "payment.captured") {
      
    // }

    // if (req.body.event === "payment.failed") {
      
    // }


    res.status(200).send({message:"webhook received successfully"}) // imp to send back the response to razorpay 
    
  } catch (err) {
    throw new Error(err)
  }
})

paymentRouter.get("/status", userAuthentication, async (req, res) => {
  try {
    const userData = req.user;
    if (userData.isPremium) {
      return res.status(200).json({message:"user is premium", isPremium:true})
    }
    return res
      .status(200)
      .json({ message: "user is not premium", isPremium: false });
  } catch (err) {
    throw new Error (err)
  }
})

module.exports = paymentRouter