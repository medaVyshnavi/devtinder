const express = require("express")
const authRouter = express.Router()
const bcrypt = require("bcrypt");

const { User } = require("../models/userSchema");
const { signUpValidations } = require("../utils/validation")

authRouter.post("/signUp", async (req, res) => {
  try {
    // validate the req.body
    signUpValidations(req);
    const { firstName, lastName, email, password } = req.body;

    // encrpt it
    const hashedPassword = await bcrypt.hash(password, 10);

    // create a new instance and save to db
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    await user.save();
    res.send("saved user to db");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      email: email,
    }).exec();

    if (!user) {
      throw new Error("Invalid Credentials");
    }
    const isPasswordValid = await user.validatePassword(password);

    if (!isPasswordValid) {
      throw new Error("Invalid Credentials");
    }

    const token = await user.getJWT();
    res.cookie("token", token, { expires: new Date(Date.now() + 800000) });
    res.json({ message: "Login succesfull" , data : user});
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

authRouter.post("/logout",async (req, res) => {
  res.clearCookie('token').send("logged out succesfully")
})

module.exports = authRouter
