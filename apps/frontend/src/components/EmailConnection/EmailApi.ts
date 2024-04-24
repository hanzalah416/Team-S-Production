// import { SubscribeCommand } from "@aws-sdk/client-sns";
// import { SNSClient } from "@aws-sdk/client-sns-node";
import { SNSClient, SubscribeCommand } from "@aws-sdk/client-sns";

//import { ConfigurationOptions } from "@aws-sdk/types";

// Configure AWS SDK SNSClient with your credentials and region
const snsClient = new SNSClient({
  region: "us-east-2", // Replace with your AWS region
  credentials: {
    accessKeyId: "YOUR_ACCESS_KEY_ID", // Replace with your AWS access key ID
    secretAccessKey: "YOUR_SECRET_ACCESS_KEY", // Replace with your AWS secret access key
  },
});

/**
 * @param {string} topicArn - The ARN of the topic the subscriber is subscribing to.
 * @param {string} email - The email address of the subscriber.
 */
export const subscribeEmail = async (topicArn: string, email: string) => {
  try {
    const response = await snsClient.send(
      new SubscribeCommand({
        Protocol: "email",
        TopicArn: topicArn,
        Endpoint: email,
      }),
    );
    console.log("Subscription successful:", response);
    return response;
  } catch (error) {
    console.error("Error subscribing email:", error);
    throw error; // Rethrow the error for handling in the calling code
  }
};

// Example usage
try {
  const email = "example@example.com"; // Replace with the email you want to subscribe
  const topicArn = "YOUR_TOPIC_ARN"; // Replace with your actual SNS topic ARN
  const subscriptionResponse = await subscribeEmail(topicArn, email);
  console.log("Subscription successful:", subscriptionResponse);
} catch (error) {
  console.error("Error subscribing email:", error);
}
