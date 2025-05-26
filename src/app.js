const express = require("express");
const { connectionDB } = require("./config/database")
const { User } = require('./models/userModel/userSchema')
const bcrypt = require("bcrypt")
const {signUpValidations} = require("./utils/validation")

const app = express();

app.use(express.json());

app.post("/signUp", async(req, res) => {
  try {
    // validate the req.body
    signUpValidations(req);
    const { firstName, lastName, email, password } = req.body;
    
    // encrpt it
    const hashedPassword = await bcrypt.hash(password, 10)
    
    // create a new instance and save to db
    const user = new User({
      firstName,
      lastName,
      email,
      password:hashedPassword
    });
    await user.save()
    res.send("saved user to db");
  } catch (error) {
    res.status(400).send(error.message)
  }
})

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      email:email
    }).exec()

    if (!user) {
      throw new Error("Invalid Credentials")
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid Credentials")
    }
    res.send("Login succesfull");
  } catch (error) {
    res.status(400).send("ERROR: " +  error)
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

app.delete("/user", async(req, res) => {
  const id = req.body.id
  try {
    await User.findByIdAndDelete(id);
    res.send("user deleted succesfully")

  } catch (error) {
    console.log("something went wrong")
    res.status(400).send("something went wrong");
  }
})

app.patch("/user/:userId", async (req, res) => {
  try {

    const reqBody = req.body
    const ALLOWED_UPDATES = ["lastName", "address", "gender", "hobbies", "photoURL"]
    
    const allowUpdate = Object.keys(reqBody).every((prop) => ALLOWED_UPDATES.includes(prop))
    
    if(!allowUpdate) throw new Error("update not allowed")
    const userId = req.params.userId
    const data = req.body
    await User.findByIdAndUpdate(userId, data,{runValidators : true})
    res.send("data updated succesfully")
    
  } catch (error) {
    console.log("something went wrong")
    res.status(400).send(error.message);
  }
})

app.patch("/userByEmail", async (req, res) => {
  try {
    const email = req.body.email;
    const data = req.body;
    await User.findOne({ email:email}).updateOne(data);
    res.send("data updated succesfully by email");
  } catch (error) {
    console.log("something went wrong");
    res.status(400).send("something went wrong");
  }
});

connectionDB().then(() => {
  console.log("db connection successfull")
  app.listen("3001", () => {
    console.log("listening on port 3001")
  })
}).catch(() => {
  console.log("error in db connection")
})