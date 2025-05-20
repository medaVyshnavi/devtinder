const express = require("express");
const { connectionDB } = require("./config/database")

const app = express();

app.use(express.json());

connectionDB().then(() => {
  console.log("db connection successfull")
  app.listen("3001", () => {
    console.log("listening on port 3001")
  })
}).catch(() => {
  console.log("error in db connection")
})