const mongoose = require("mongoose")
const {Schema} = mongoose

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  age: Number,
  address: String,
  dob: Date,
  email: String,
  password:String
})

const User = mongoose.model("User", userSchema)

module.exports = {
  User 
}