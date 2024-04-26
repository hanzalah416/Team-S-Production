import React, { useState } from "react";
//import { subscribeEmail } from "./EmailApi.ts";
import axios from "axios";
//import styles from "../service_requests/SecurityRequest.module.css";

// interface EmailFormProps {
//     topicArn: string;
// }
export default function awsPublishForm() {
  const [topicARN, setTopicARN] = useState("");
  const [message, setMessage] = useState("");

  async function submit() {
    const newEntry = {
      message: message,
      topicArn: topicARN,
    };

    await axios
      .post("/api/aws-publish", newEntry, {})
      .then(() => {
        console.log("Successfully published messaged");
      })
      .catch(() => {
        console.log("Failed to publish");
        console.log(newEntry);
        alert("Message failed to publish");
      });
    clear();
  }

  function clear() {
    setMessage("");
    setTopicARN("");
  }

  return (
    <div>
      <form onSubmit={submit}>
        <label htmlFor="messageInput">Enter Message:</label>
        <input
          type="message"
          id="messageInput"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <label htmlFor="topicArn">Enter topic arn:</label>
        <input
          type="topic"
          id="topicInput"
          value={topicARN}
          onChange={(e) => setTopicARN(e.target.value)}
          required
        />
        <button type="submit">Message</button>
      </form>
    </div>
  );
}
