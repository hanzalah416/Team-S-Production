import express, { Router, Request, Response } from "express";
import AWS from "aws-sdk";
const router: Router = express.Router();

// this is a post request that will allow the admin to send out mass emails
router.post("/", async function (req: Request, res: Response) {
  const { message, topicArn } = req.body;
  const params = {
    Message: message,
    TopicArn: topicArn,
  };

  try {
    // Create promise and SNS service object
    const publishTextPromise = new AWS.SNS({ apiVersion: "2010-03-31" })
      .publish(params)
      .promise();

    // Handle promise's fulfilled state
    const data = await publishTextPromise;
    console.log(
      `Message ${params.Message} sent to the topic ${params.TopicArn}`,
    );
    console.log("MessageID is " + data.MessageId);

    res.status(200).json({ message: "Message sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send message" });
  }
});

export default router;
