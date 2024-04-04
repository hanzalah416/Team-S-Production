// import {Link} from "react-router-dom";
import React, { useState } from "react";
import styles from "./CreateAccount.module.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { userform } from "./common/userform.ts";

const CreateAccount: React.FC = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const navigate = useNavigate();
  const handleBack = () => {
    // You may want to validate or process data here before navigating
    navigate("/");
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Here you would handle the submission of the payment form
    // Maybe sending the data to your server or processing the payment
  };

  const handleCreateAccount = () => {
    // You may want to validate or process data here before navigating
    if (
      isSamePasswords() &&
      password != "" &&
      passwordAgain != "" &&
      username != "" &&
      email != ""
    ) {
      navigate("/welcome");
    } else {
      throw new Error("Passwords don't match");
    }
  };

  async function createAccount() {
    handleCreateAccount();
    const createdAccount: userform = {
      userName: username,
      userEmail: email,
      userPassword: password,
    };
    console.log(createdAccount);
    const res = await axios.post("/api/create-user", createdAccount, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log(res);

    if (res.status == 200) {
      console.log("Order sent successfully");
      navigate("/welcome");
    } else if (res.status == 400) {
      console.log("Order failed to send");
      navigate("/create-account");
    }
  }

  const isSamePasswords = (): boolean => {
    return passwordAgain == password;
  };

  return (
    <body>
      <div className={styles.wholePage}>
        <img src="./assets/bwh-logo.svg" />
        <h2 className={styles.title}>Create Account</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <h2 className={styles.header}>Email</h2>
            <input
              className={styles.input}
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
          <div className={styles.formGroup}>
            <h2 className={styles.header}>Username</h2>
            <input
              className={styles.input}
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
          </div>

          <div className={styles.formGroup}>
            <h2 className={styles.header}>Password</h2>
            <input
              className={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>
          <div className={styles.formGroup}>
            <h2 className={styles.header}>Confirm Password</h2>
            <input
              className={styles.input}
              type="password"
              value={passwordAgain}
              onChange={(e) => setPasswordAgain(e.target.value)}
              placeholder="Retype your password"
            />
          </div>
        </form>
        <div className={styles.buttonGroup}>
          <button
            className={`${styles.button} ${styles.backButton}`}
            type="button"
            onClick={handleBack}
          >
            Back
          </button>
          <button
            className={`${styles.button} ${styles.reviewButton}`}
            type="button"
            onClick={createAccount}
          >
            Create Account
          </button>
        </div>
      </div>
    </body>
  );
};
export default CreateAccount;
