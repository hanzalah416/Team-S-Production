import React, { useState, useEffect } from "react";
import styles from "./Login.module.css";

import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

// import Link from '@mui/material/Link';
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";



const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const [backgroundImage, setBackgroundImage] = useState<string>(
    "/src/components/assets/HeroPhotos/Temp1.png",
  );

  useEffect(() => {
    const imageUrls = [
      "/src/components/assets/HeroPhotos/Temp1.png",
      "/src/components/assets/HeroPhotos/Temp2.png",
      "/src/components/assets/HeroPhotos/Temp3.png",
    ];
    const randomImageUrl =
      imageUrls[Math.floor(imageUrls.length * Math.random())];
    setBackgroundImage(`url(${randomImageUrl})`);
  }, []);

  const handleLogin = async () => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [loginData, setLoginData] = useState("");
      useEffect(() => {
          async function fetchData() {
              const res = await axios.get("/api/create-user");
              setLoginData(res.data);
              console.log("successfully got data from get request");
          }

          fetchData().then();
      }, []);
      return (
          <div className="flex flex-colgap-5">
              {feedBackData != undefined ? (
                  feedBackData.map((loginData) => {
                      return <FeedBackDisplay feedback={feedback}></FeedBackDisplay>;
                  })
              ) : (
                  <></>
              )}
          </div>
      );


  };




  return (
    <div>
      <div className={styles.wholePage}>
        <div className={styles.container}>
          <form className={styles.signInForm}>
            <img
              src="/src/components/assets/bwh-logo.svg"
              className={styles.logo}
              alt={"BWH logo"}
            />
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
              <FormControlLabel
                control={<Checkbox />}
                label="Remember Me"
                style={{ color: "black" }}
              />
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
                Don't have an account?{" "}
                <Link to={"/create-account"}> Sign Up</Link>
              </p>
            </div>
          </form>
          <div
            className={styles.slideShow}
            style={{ backgroundImage: backgroundImage }}
          >
            {/*<img src="/src/components/assets/HeroPhotos/Temp1.png" className={"heroImage"} alt={"map"}/>*/}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
