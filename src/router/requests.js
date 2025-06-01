const express = require("express");
const requestsRouter = express.Router();
const { userAuthentication } = require("../middlewares/auth");

requestsRouter.post(
  "/sendConnectionRequest",
  userAuthentication,
  async (req, res) => {
    res.send(req.user);
  }
);

module.exports = requestsRouter