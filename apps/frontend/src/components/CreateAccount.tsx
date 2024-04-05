// import {Link} from "react-router-dom";
import React, { useState } from "react";
import styles from "./CreateAccount.module.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { userform } from "./common/userform.ts";
import bwhLogo from "./assets/bwh-logo.svg";
import TextField from "@mui/material/TextField";

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
        <img src={bwhLogo} />
        <h2 className={styles.title}>Create Account</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
              <TextField id="standard-basic" label="Email" variant="standard" className={styles.muiInput} onChange={(e) => setEmail(e.target.value)}/>
          </div>
          <div className={styles.formGroup}>
              <TextField id="standard-basic" label="Username" variant="standard" className={styles.muiInput} onChange={(e) => setUsername(e.target.value)}/>
          </div>

          <div className={styles.formGroup}>
              <TextField type = "password" id="standard-basic" label="Password" variant="standard" className={styles.muiInput} onChange={(e) => setPassword(e.target.value)}/>
          </div>
          <div className={styles.formGroup}>
              <TextField type = "password" id="standard-basic" label="Confirm Password" variant="standard" className={styles.muiInput} onChange={(e) => setPasswordAgain(e.target.value)}/>
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
