const express = require("express");
const app = express();

app.use("/hello", (req, res) => {
  res.send("my express server says hello");
});

app.use("/test", (req, res) => {
  res.send("my express server is testing you");
});

app.use("/",(req, res) => {
  res.send("my express server")
})

app.listen(3001, () => {
  console.log("listening to port 3001")
});