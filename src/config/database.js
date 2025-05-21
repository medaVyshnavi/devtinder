const mongoose = require("mongoose")

const connectionDB = async() => {
  await mongoose.connect(
    "mongodb+srv://vyshnavivenkatesh:tOSVtWIW08RJgWYa@cluster0.j2l7cge.mongodb.net/devTinder"
  );
}

module.exports = {
  connectionDB
}