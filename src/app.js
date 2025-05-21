const express = require("express");
const { connectionDB } = require("./config/database")
const { User } = require('./models/userModel/userSchema')

const app = express();

app.use(express.json());

app.post("/signUp", async(req, res) => {
  const userObj = {
    firstName: "vysh",
    lastName: "venkatesh",
    email: "vysh@gmail.com",
    password: "123456",
  };

  try {
    const user = new User(userObj);
    await user.save()
    res.send("saved user to db");
  } catch (error) {
    res.status(400).send(error)
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