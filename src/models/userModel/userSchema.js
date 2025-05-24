const mongoose = require("mongoose")
const {Schema} = mongoose

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minLength: 5,
    },
    lastName: {
      type: String,
      trim: true,
    },
    age: {
      type: Number,
      min: 18,
    },
    address: {
      type: String,
      trim: true,
    },
    dob: {
      type: Date,
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "other"],
        message: "Gender is not a valid option"
      }
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      validate: {
        validator: (value) => {
          return value.includes("@");
        },
        message: "Email must contain @",
      },
    },
    password: {
      type: String,
      trim: true,
      required: true,
      minLength: 8,
    },
    hobbies: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema)

module.exports = {
  User 
}