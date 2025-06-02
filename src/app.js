const express = require("express");
const cookie_parser = require("cookie-parser");

const { connectionDB } = require("./config/database")
const authRouter = require("./router/auth")
const profileRouter = require("./router/profile");
const requestsRouter = require("./router/requests");

const app = express();

app.use(express.json());
app.use(cookie_parser())

app.use('/', authRouter);
app.use("/profile", profileRouter);
app.use("/", requestsRouter);

connectionDB().then(() => {
  console.log("db connection successfull")
  app.listen("3001", () => {
    console.log("listening on port 3001")
  })
}).catch(() => {
  console.log("error in db connection")
})