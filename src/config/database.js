const mongoose = require("mongoose")

const connectionDB = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION_STRING);
    console.log("db connection successful");
  
  } catch (err) {
    console.log("error in db connection:", err.message);
  }
}

module.exports = {
  connectionDB
}