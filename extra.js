// app.patch("/userByEmail", async (req, res) => {
//   try {
//     const email = req.body.email;
//     const data = req.body;
//     await User.findOne({ email: email }).updateOne(data);
//     res.send("data updated succesfully by email");
//   } catch (error) {
//     console.log("something went wrong");
//     res.status(400).send("something went wrong");
//   }
// });

// app.patch("/user/:userId", async (req, res) => {
//   try {
//     const reqBody = req.body;
//     const ALLOWED_UPDATES = [
//       "lastName",
//       "address",
//       "gender",
//       "hobbies",
//       "photoURL",
//     ];

//     const allowUpdate = Object.keys(reqBody).every((prop) =>
//       ALLOWED_UPDATES.includes(prop)
//     );

//     if (!allowUpdate) throw new Error("update not allowed");
//     const userId = req.params.userId;
//     const data = req.body;
//     await User.findByIdAndUpdate(userId, data, { runValidators: true });
//     res.send("data updated succesfully");
//   } catch (error) {
//     console.log("something went wrong");
//     res.status(400).send(error.message);
//   }
// });

// app.delete("/user", async (req, res) => {
//   const id = req.body.id;
//   try {
//     await User.findByIdAndDelete(id);
//     res.send("user deleted succesfully");
//   } catch (error) {
//     console.log("something went wrong");
//     res.status(400).send("something went wrong");
//   }
// });

// app.get("/user", async (req, res) => {
//   const email = req.query.emailId;
//   try {
//     const user = await User.find({ emailId: email });
//     res.send(user);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// app.get("/feed", async (req, res) => {
//   try {
//     const usersList = await User.find();
//     res.send(usersList);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });