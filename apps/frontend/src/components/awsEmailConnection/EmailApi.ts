// import { SubscribeCommand } from "@aws-sdk/client-sns";
// import { SNSClient } from "@aws-sdk/client-sns-node";
import { SNSClient, SubscribeCommand } from "@aws-sdk/client-sns";

//import { ConfigurationOptions } from "@aws-sdk/types";

// This is the log in
const snsClient = new SNSClient({
  region: "us-east-2",
  credentials: {
    accessKeyId: "AKIA4MTWLL2KFO44KCM5",
    secretAccessKey: "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",
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
    throw error;
  }
};
