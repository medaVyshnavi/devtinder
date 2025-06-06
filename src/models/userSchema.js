const mongoose = require("mongoose")
const validator = require("validator")
const { Schema } = mongoose
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

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
      required: true,
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
        message: "Gender is not a valid option",
      },
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      validate: [
        {
          validator: (value) => validator.isEmail(value),
          message: "email is not a valid value.",
        },
      ],
    },
    password: {
      type: String,
      trim: true,
      required: true,
      minLength: 8,
    },
    hobbies: {
      type: [String],
      validate: [
        {
          validator: arrayLimit,
          message: "Can only add upto 6 values",
        },
        {
          validator: function (value) {
            return new Set(value).size === value.length;
          },
          message: "unique hobbies are allowed",
        },
      ],
      default:[]
    },
    photoURL: {
      type: String,
      default:
        "https://t3.ftcdn.net/jpg/05/87/76/66/360_F_587766653_PkBNyGx7mQh9l1XXPtCAq1lBgOsLl6xH.jpg",
    },
    about: {
      type: String,
      trim : true
    }
  },
  {
    timestamps: true,
  }
);

function arrayLimit(val) {
  return !val || val.length <= 6
};

userSchema.methods.getJWT = async function () {
  const token = await jwt.sign({ _id: this._id }, "devTinder@2712", {
    expiresIn: "1h",
  });
  return token;
}

userSchema.methods.validatePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema)

module.exports = {
  User 
}