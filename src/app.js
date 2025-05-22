const express = require("express");
const { connectionDB } = require("./config/database")
const { User } = require('./models/userModel/userSchema')

const app = express();

app.use(express.json());

app.post("/signUp", async(req, res) => {
  const userObj = req.body;

  try {
    const user = new User(userObj);
    await user.save()
    res.send("saved user to db");
  } catch (error) {
    res.status(400).send(error)
  }
})

app.get("/feed", async (req, res) => {
  try {
    const usersList = await User.find();
    res.send(usersList);
  } catch (error) {
    res.status(400).send(error);
  }
})

app.get("/user", async (req, res) => {
  const email = req.query.emailId
  try {
    const user = await User.find({emailId : email});
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
})

connectionDB().then(() => {
  console.log("db connection successfull")
  app.listen("3001", () => {
    console.log("listening on port 3001")
  })
}).catch(() => {
  console.log("error in db connection")
})