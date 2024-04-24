import React, { useState } from "react";
import { subscribeEmail } from "./EmailApi.ts"; // Import the SNS subscription function

interface EmailFormProps {
  topicArn: string;
}

const EmailForm: React.FC<EmailFormProps> = ({ topicArn }) => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await subscribeEmail(topicArn, email);
      alert("Subscription successful!");
      setEmail("");
    } catch (error) {
      console.error("Error subscribing email:", error);
      alert("Subscription failed. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="emailInput">Enter Email:</label>
      <input
        type="email"
        id="emailInput"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type="submit">Subscribe</button>
    </form>
  );
};

export default EmailForm;
