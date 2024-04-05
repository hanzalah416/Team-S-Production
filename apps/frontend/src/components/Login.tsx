import React, { useState, useEffect } from "react";
import styles from "./Login.module.css";
import TextField from "@mui/material/TextField";
import heroImage from "./assets/HeroPhotos/Temp1.png";
import heroImage2 from "./assets/HeroPhotos/nurse6.jpg";
import heroImage3 from "./assets/HeroPhotos/Temp3.png";
import bwhLogo from "./assets/bwh-logo.svg";

import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";

// import Link from '@mui/material/Link';
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
// import {loginform} from "./common/loginform.ts";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const [backgroundImage, setBackgroundImage] = useState<string>(heroImage);

  useEffect(() => {
    const imageUrls = [heroImage, heroImage2, heroImage3];
    const randomImageUrl =
      imageUrls[Math.floor(imageUrls.length * Math.random())];
    setBackgroundImage(`url(${randomImageUrl})`);
  }, []);

  // const handleLogin = async () => {
  //     navigate('welcome');
  //
  //     const [loginCreds, setLoginCreds] = useState<loginform[]>([]);
  //
  //     await axios.get("/api/create-user").then((response) => {setLoginCreds(response.data);});
  //     console.log("successfully got data from get request");
  //     loginCreds.forEach((loginform) => {
  //         if(loginform.userPassword == password && loginform.userName == username) {
  //             navigate('/welcome');
  //         } else {
  //             navigate('/');
  //         }
  //     });
  //
  // };

  const handleLogin = () => {
    if (username == "admin" && password == "admin") {
      navigate("welcome");
    } else {
      throw new Error("Invalid login!");
    }
  };

  return (
    <div>
      <div className={styles.wholePage}>
        <div className={styles.container}>
          <form className={styles.signInForm}>
            <img src={bwhLogo} className={styles.logo} alt={"BWH logo"} />
            <h2 className={styles.title}>Sign in</h2>

            <div className={styles.formGroup}>
              <TextField
                id="standard-basic"
                label="Username"
                variant="standard"
                className={styles.muiInput}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <TextField
                id="standard-basic"
                label="Password"
                variant="standard"
                className={styles.muiInput}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

              <div className={styles.formGroup}>
                  <TextField type = "password"  id="standard-basic" label="Password" variant="standard" className={styles.muiInput} onChange={(e) => setPassword(e.target.value)}/>
              </div>


            <div className={styles.extras}>
              <FormControlLabel
                control={<Checkbox />}
                label="Remember Me"
                style={{ color: "black" }}
              />
              {/*<p className={styles.forgotPassword}>*/}
              {/*  <a className={styles.forgotLink} href="url">*/}
              {/*    FORGOT PASSWORD?*/}
              {/*  </a>*/}
              {/*</p>*/}
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
              <p className={styles.signUp}>
                Don't have an account?{" "}
                <Link to={"/create-account"}> Sign Up</Link>
              </p>
            </div>
          </form>
          <div
            className={styles.slideShow}
            style={{ backgroundImage: backgroundImage }}
          >
            {/*<img src="./src/components/assets/HeroPhotos/Temp1.png" className={"heroImage"} alt={"map"}/>*/}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
