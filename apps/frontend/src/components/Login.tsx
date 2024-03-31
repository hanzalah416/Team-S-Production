import React, { useState } from "react";
import styles from "./Login.module.css";
import {Link, useNavigate} from "react-router-dom";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = () => {
    // You may want to validate or process data here before navigating
    navigate("/welcome");
  };

  // const handleCreateAccount = () => {
  //   // You may want to validate or process data here before navigating
  //   navigate("/create-account");
  // };

  return (
    <div className={styles.container}>
      <form className={styles.signInForm}>
        <h2 className={styles.title}>Sign in</h2>

        <div className={styles.formGroup}>
          <input
            className={styles.input}
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
        </div>

        <div className={styles.formGroup}>
          <input
            className={styles.input}
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </div>

        <div className={styles.extras}>
          <div className={styles.cb}>
            <input type="checkbox" />
            <label className={styles.remember}>REMEMBER ME</label>
          </div>

          <p className={styles.forgotPassword}>
            <a className={styles.forgotLink} href="url">
              FORGOT PASSWORD?
            </a>
          </p>
        </div>

          <div className={styles.buttonGroup}>
              <div className={styles.buttonGroup}>
                  <button
                      className={`${styles.button} ${styles.loginButton}`}
                      type="button"
                      onClick={handleLogin}
                  >
                      Login
                  </button>
              </div>
              <p className={styles.forgotPassword}>
                  Don't have an account? <Link to={"/create-account"}> Sign Up</Link>
              </p>
              {/*<div className={styles.buttonGroup}>
            <button
              className={`${styles.button} ${styles.newAcctButton}`}
              type="button"
              onClick={handleCreateAccount}
            >
              Create Account
            </button>
          </div>*/}
          </div>
      </form>
        <div className={styles.slideShow}></div>
    </div>
  );
};

export default Login;
