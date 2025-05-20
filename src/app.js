const express = require("express");
const app = express();

app.use(express.json());

app.use("/test", (req, res) => {
  throw new Error("erooorrrrr")
})

app.use("/", (req, res) => {
  throw new Error("generic error");
});

app.use((error, req, res, next) => {
  res.status(500).send(error.message)
})

// app.use((req, res, next) => {
//   res.send("bye bye")
// })

// app.use(
//   "/",
//   (req, res, next) => {
//     console.log("my express server says hello once");
//      next();
//     res.send("okay coming")
//   },
//   (req, res, next) => {
//     console.log("my express server says hello twice");
//     next();
//     res.send("okay wait");
//   }
// );

// app.get("/users", (req, res) => {
//   res.send({name:"vyshnavi",place:"tokyo"})
// });

// app.post("/users", (req, res) => {
//   console.log(req.body);
//   res.send("data recieevd ")
// });

app.listen(3001, () => {
  console.log("listening to port 3001")
});