import React, { useState, useEffect } from "react";
import styles from "./Login.module.css";

import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

// import Link from '@mui/material/Link';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';



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
      "/src/components/assets/HeroPhotos/Temp3.png",
        "/src/components/assets/HeroPhotos/nurse6.jpg"
    ];
    const randomImageUrl =
      imageUrls[Math.floor(imageUrls.length * Math.random())];
    setBackgroundImage(`url(${randomImageUrl})`);
  }, []);

  const handleLogin = () => {

      axios.get("/api/log/in",{
          params: {
            userName: username,
            userPassword: password
          }}).then((res) => {
              if(res.data.success){
                  navigate("/welcome");
              }
              else {
                  console.error("Login failed: ", res.data.message);
              }
      });
  };



  return (
    <div>

    <div className={styles.wholePage}>

        <div className={styles.container}>
            <form className={styles.signInForm}>
                <img src="/src/components/assets/bwh-logo.svg" className={styles.logo} alt={"BWH logo"}/>
                <h2 className={styles.title}>Sign in</h2>

                <p className={styles.inputTxt}>Username</p>
                <div className={styles.formGroup}>
                    <input className={styles.input} type="text" value={username}
                           onChange={(e) => setUsername(e.target.value)} placeholder="Enter your username"/>
                </div>

                <p className={styles.inputTxt}>Password</p>
                <div className={styles.formGroup}>
                    <input className={styles.input} type="text" value={password}
                           onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password"/>
                </div>

                <div className={styles.extras}>
                    <FormControlLabel control={<Checkbox/>} label="Remember Me" style={{color: '#444444'}}/>
                    <p className={styles.forgotPassword}>
                        <a className={styles.forgotLink} href="url">Forgot Password?</a>
                    </p>
                </div>

                <div className={styles.buttonGroup}>
                    <div className={styles.buttonGroup}>
                        <button className={`${styles.button} ${styles.loginButton}`} type="button" onClick={handleLogin}>LOGIN</button>
                    </div>
                    <p className={styles.forgotPassword}>Don't have an account?{" "}<Link to={"/create-account"} className={styles.suLink}> Sign
                        Up</Link></p>
                </div>
            </form>

            <div className={styles.slideShow} style={{backgroundImage: backgroundImage}}>
                {/*<img src="/src/components/assets/HeroPhotos/Temp1.png" className={"heroImage"} alt={"map"}/>*/}
            </div>
        </div>
    </div>

    </div>
  );
};

export default Login;
