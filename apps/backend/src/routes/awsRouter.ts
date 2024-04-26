import express, { Router, Request, Response } from "express";
import { SNSClient, SubscribeCommand } from "@aws-sdk/client-sns";
const router: Router = express.Router();

const snsClient = new SNSClient({ region: "YOUR_REGION" });

// this is a post request that uses aws snsclient to connect with aws and subsribe people to an email list
router.post("/", async function (req: Request, res: Response) {
  const { email } = req.body;
  const topicArn = "arn:aws:sns:us-east-2:851725475476:Hospital_Alerts";

  try {
    const response = await snsClient.send(
      new SubscribeCommand({
        Protocol: "email",
        TopicArn: topicArn,
        Endpoint: email,
      }),
    );
    console.log("Subscription successful:", response);
    res.status(200).json({ message: "Subscription successful" });
  } catch (error) {
    console.error("Error subscribing email:", error);
    res.status(500).json({ error: "Subscription failed" });
  }
});

export default router;
