const express = require("express");
const cookie_parser = require("cookie-parser");
const cors = require("cors")
require("dotenv").config();
require("./utils/cronjob")

const { connectionDB } = require("./config/database")
const authRouter = require("./router/auth")
const profileRouter = require("./router/profile");
const requestsRouter = require("./router/requests");
const userRouter = require("./router/user")
const paymentRouter = require("./router/payment")
const chatRouter = require("./router/chat");

// socket.io
const { createServer } = require("http");
const initializeSocket = require("./utils/socketio");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
);
app.use(express.json());
app.use(cookie_parser())

app.use('/', authRouter);
app.use("/profile", profileRouter);
app.use("/request", requestsRouter);
app.use("/user", userRouter)
app.use("/payment", paymentRouter)
app.use("/chat", chatRouter);

const httpServer = createServer(app);
initializeSocket(httpServer)


connectionDB().then(() => {
  httpServer.listen(process.env.PORT, () => {
    console.log("db connection successfull");
    console.log("listening on port 3001")
  })
}).catch(() => {
  console.log("error in db connection")
})