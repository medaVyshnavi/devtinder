const mongoose = require("mongoose")

const connectionDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://vyshnavivenkatesh:tOSVtWIW08RJgWYa@cluster0.j2l7cge.mongodb.net/devTinder"
    )
    console.log("db connection successful");
  
  } catch (err) {
    console.log("error in db connection:", err.message);
  }
}

module.exports = {
  connectionDB
}