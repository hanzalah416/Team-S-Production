import React from "react";
import EmailForm from "./EmailForm";

const awsForm: React.FC = () => {
  const topicArn = "YOUR_TOPIC_ARN"; // Replace with your actual SNS topic ARN

  return (
    <div className="YourPageComponent">
      <h1>Email Subscription Form</h1>
      <EmailForm topicArn={topicArn} />
    </div>
  );
};

export default awsForm;
