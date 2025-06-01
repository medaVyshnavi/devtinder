const express = require("express");
const profileRouter = express.Router();
const { userAuthentication } = require("../middlewares/auth");

profileRouter.get("/profile", userAuthentication, async (req, res) => {
  try {
    const userDetails = req.user;
    res.send(userDetails);
  } catch (error) {
    res.status(400).send("ERROR " + error.message);
  }
});

module.exports = profileRouter