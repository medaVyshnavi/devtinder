const jwt = require("jsonwebtoken")
const {User} = require("../models/userModel/userSchema")

const userAuthentication = async(req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) throw new Error("Invalid token")
    
    const decoded = await jwt.verify(token, "devTinder@2712");
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