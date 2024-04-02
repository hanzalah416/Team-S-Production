import React, { useState, useEffect } from "react";
import styles from "./Login.module.css";
import {Link, useNavigate} from "react-router-dom";
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [backgroundImage, setBackgroundImage] = useState<string>(
      "/src/components/assets/HeroPhotos/Temp1.png"
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
  const handleLogin = () => {
    // You may want to validate or process data here before navigating
    navigate("/welcome");
  };



  return (
   <div className={styles.wholePage}>
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
            <FormControlLabel
                control={<Checkbox  />}
                label="Remember Me"
                style={{color: 'black'}}
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
                  Don't have an account? <Link to={"/create-account"}> Sign Up</Link>
              </p>
          </div>
      </form>
        <div className={styles.slideShow}
        style={{ backgroundImage: backgroundImage }}
        >
            {/*<img src="/src/components/assets/HeroPhotos/Temp1.png" className={"heroImage"} alt={"map"}/>*/}
        </div>
    </div>
      </div>
  );
};

export default Login;
