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

const validateProfileUpdateData = (req) => {
  const allowedFields = [
    "firstName",
    "lastName",
    "gender",
    "age",
    "photoURL",
    "about",
    "hobbies",
    "dob",
    "address"
  ];
  
  const isAllowed = Object.keys(req).every(field => allowedFields.includes(field));
  if(!isAllowed){
    throw new Error("Invalid fields to update");
  }
  return isAllowed
}

module.exports = { signUpValidations, validateProfileUpdateData };