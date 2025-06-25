const { SESClient } = require("@aws-sdk/client-ses")
// Set the AWS Region.
const REGION = process.env.REGION;
// Create SES service object.
const sesClient = new SESClient({
  region: REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.ACCESS_KEY_SECRET,
  },
});
module.exports =  { sesClient };
