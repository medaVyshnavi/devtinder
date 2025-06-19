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

    const token = await user.getJWT();

    const userProfile = {
      firstName: user.firstName,
      lastName: user.lastName,
      age: user.age,
      gender: user.gender,
      about: user.about,
      photoURL: user.photoURL,
    };
    res.cookie("token", token, { expires: new Date(Date.now() + 8000000) });
    res.status(200).json({message:"Successfully created an account", data: userProfile});
  } catch (error) {
    res.status(400).json({message:error.message});
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      email: email,
    }).exec();

    if (!user) {
      return res.status(400).json({message:"Invalid Credentials"});
    }
    const isPasswordValid = await user.validatePassword(password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const token = await user.getJWT();
    const userProfile = { firstName: user.firstName, lastName: user.lastName, age:user.age,gender:user.gender, about:user.about, photoURL: user.photoURL}
    res.cookie("token", token, { expires: new Date(Date.now() + 8000000) });
    res.status(200).json({ message: "Login successfull", data: userProfile });

  } catch (error) {
    res.status(400).send({message: error.message});
  }
});

authRouter.post("/logout",async (req, res) => {
  res.clearCookie('token').json({message:"logged out succesfully"})
})

module.exports = authRouter
