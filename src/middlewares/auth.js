const jwt = require("jsonwebtoken")
const {User} = require("../models/userSchema")

const userAuthentication = async(req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).send({message : "Please login."})
    }
    
    const decoded = await jwt.verify(token, process.env.JWT_SECERT);
    const userId = decoded._id

    const user = await User.findById({ _id: userId });
    if (!user) throw new Error("Invalid Credentials")
    
    req.user = user;
    next()
  }catch (error) {
    res.status(400).send(error.message)
  }
}

module.exports = {userAuthentication}