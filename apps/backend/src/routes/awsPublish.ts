import express, { Router, Request, Response } from "express";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

const router: Router = express.Router();

const snsClient = new SNSClient({
  region: "us-east-2",
  credentials: {
    accessKeyId: "AKIA4MTWLL2KFO44KCM5",
    secretAccessKey: "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",
  },
});

// post request to send mass emails
router.post("/", async function (req: Request, res: Response) {
  const { message, topicArn } = req.body;

  try {
    const response = await snsClient.send(
      new PublishCommand({
        Message: message,
        TopicArn: "arn:aws:sns:us-east-2:851725475476:Brighams-Hospital",
      }),
    );

    console.log(
      `Message "${message}" sent to the topic "${topicArn}", MessageId: ${response.MessageId}`,
    );

    res.status(200).json({ message: "Message sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send message" });
  }
});

export default router;
