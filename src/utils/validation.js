const validator = require("validator")

const signUpValidations = (req) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name is required");
  }
  if (!validator.isEmail(email)) {
    throw new Error("enter a valid email")
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error("enter a strong password")
  }
}

module.exports = {signUpValidations}