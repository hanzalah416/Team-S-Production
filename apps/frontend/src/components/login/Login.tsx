import React, { useState, useEffect } from "react";
import styles from "./Login.module.css";
import heroImage from "../assets/HeroPhotos/Temp1.png";
import heroImage2 from "../assets/HeroPhotos/nurse6.jpg";
import heroImage3 from "../assets/HeroPhotos/Temp3.png";
import bwhLogo from "../assets/bwh-logo.svg";
const Login: React.FC = () => {

    // const navigate = useNavigate();
  const [backgroundImage, setBackgroundImage] = useState<string>(heroImage);

  useEffect(() => {
    const imageUrls = [heroImage, heroImage2, heroImage3];
    const randomImageUrl =
      imageUrls[Math.floor(imageUrls.length * Math.random())];
    setBackgroundImage(`url(${randomImageUrl})`);
  }, []);


  return (

    <div >
      <div className={styles.wholePage}>
        <div className={styles.container}>
          <form className={styles.signInForm}>
            <img src={bwhLogo} className={styles.logo} alt={"BWH logo"} />
            <div className={styles.buttonGroup}>
              <div className={styles.buttonGroup}>


              </div>
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
