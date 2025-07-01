const cron = require('node-cron');
const { subDays, startOfDay, endOfDay } = require("date-fns");
const sendEmail = require("../utils/sendEmail")
const { ConnectionRequest } = require('../models/connectionRequestSchema');

cron.schedule("0 0 25 1 0", async() => {
  console.log("cron-job schedule started")

  //send emails to people who got connection request the previous day start to previous day end.
  try {
    const yesterday = subDays(new Date(), 1);

    const startOfYesterday = startOfDay(yesterday);
    const endOfYesterday = endOfDay(yesterday);

    const requestList = await ConnectionRequest.find({
      status: "interested",
      createdAt: {
        $gte: startOfYesterday,
        $lt: endOfYesterday,
      },
    }).populate("toUserId", ["email"]);

    const emailList = Array.from(new Set(requestList.map(list => list.toUserId.email)));

    for (const email of emailList){
      const res = await sendEmail.run();
      console.log(res)
    }

  } catch (err) {
    console.log(err)
  }
  console.log("cron-job schedule ended");
})