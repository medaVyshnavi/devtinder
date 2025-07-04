const express = require("express");
const profileRouter = express.Router();
const { userAuthentication } = require("../middlewares/auth");
const { validateProfileUpdateData } = require("../utils/validation");
const bcrypt = require("bcrypt");

profileRouter.get("/view", userAuthentication, async (req, res) => {
  try {
    const userDetails = {
      id:req.user._id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      age: req.user.age,
      gender: req.user.gender,
      about: req.user.about,
      photoURL: req.user.photoURL,
    };
    
    res.status(200).json({data: userDetails });
  } catch (error) {
    res.status(400).send("ERROR " + error.message);
  }
});

profileRouter.patch("/edit", userAuthentication, async(req, res) => {
  try {
    const isAllowed = validateProfileUpdateData(req.body)
    if (isAllowed) {
      const loggedInUser = req.user;
      Object.keys(req.body).every(
        (field) => (loggedInUser[field] = req.body[field])
      );

      await loggedInUser.save();
      res.status(200).send({message: "updated data",data : loggedInUser})
    }
  } catch (error) {
    res.status(400).json({message : error.message});
  }
})

profileRouter.patch("/password", userAuthentication, async (req, res) => {
  try {
    const user = req.user;
    const { oldPassword, newPassword } = req.body;
    const isPasswordValid = await user.validatePassword(oldPassword);
    if (!isPasswordValid) {
      throw new Error("existing password is not valid");
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    res.status(200).json({ message: "password updated succesfully" });

  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

module.exports = profileRouter