const { SendEmailCommand } = require ("@aws-sdk/client-ses")
const { sesClient } = require ("./sesClient.js")

const createSendEmailCommand = (toAddress, fromAddress) => {
  return new SendEmailCommand({
    Destination: {
      /* required */
      CcAddresses: [
        /* more items */
      ],
      ToAddresses: [
        toAddress,
        /* more To-email addresses */
      ],
    },
    Message: {
      /* required */
      Body: {
        /* required */
       Html: {
        Charset: "UTF-8",
        Data: "<h1>Welcome to DevTinder!</h1><p>Glad to have you onboard.</p>"
      },
        Text: {
          Charset: "UTF-8",
          Data: "Welcome to DevTinder! You have successfully signed up!",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "hello from SES",
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [
      /* more items */
    ],
  });
};

const run = async () => {
  const sendEmailCommand = createSendEmailCommand(
    "medavyshnavi2023@gmail.com",
    "vyshnavivenkatesh@gmail.com"
  );

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
    if (caught instanceof Error && caught.name === "MessageRejected") {
      const messageRejectedError = caught;
      return messageRejectedError;
    }
    throw caught;
  }
};

module.exports = { run };
