const express = require("express");
const app = express();

app.use(express.json());

app.use("/", (req, res,next) => {
  console.log("my express server says hello");
  next();
});

app.get("/users", (req, res) => {
  res.send({name:"vyshnavi",place:"tokyo"})
});

app.post("/users", (req, res) => {
  console.log(req.body);
  res.send("data recieevd ")
});

app.listen(3001, () => {
  console.log("listening to port 3001")
});