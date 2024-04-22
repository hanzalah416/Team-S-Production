// import React, { useState} from "react";
import styles from "./Login.module.css";
import heroImage from "../assets/HeroPhotos/heroImage.png";
import heroImage1 from "../assets/HeroPhotos/nurse6.jpg";
import heroImage2 from "../assets/HeroPhotos/Temp1.png";
import heroImage3 from "../assets/HeroPhotos/Temp3.png";
import mapImage from "../assets/HeroPhotos/mapImage.png";
import Button from "@mui/material/Button";
// import bwhLogo from "../assets/bwh-logo.svg";
import { useNavigate } from "react-router-dom";
import {useEffect, useState} from "react";

const Login: React.FC = () => {
  const navigate = useNavigate();
    const [currentImage, setCurrentImage] = useState(0);
  const navigateMap = () => {
    navigate("/floor-map");
  };

    const images = [
        heroImage,
        heroImage1,
        heroImage2, heroImage3
    ];

    useEffect(() => {
        const intervalId = setInterval(() => {
            // Rotate to the next image
            setCurrentImage((prevImage) => (prevImage + 1) % images.length);
        }, 3000); // Change the duration (in milliseconds) to adjust the speed

        return () => clearInterval(intervalId); // Cleanup on unmount
    }, [images.length]);




  return (
    <div>
      <div className={styles.container}>
          <div className={styles.imageContainer}>

              <div className={styles.slideshowContainer}>
                  {images.map((imageUrl, index) => (
                      <img
                          key={index}
                          src={imageUrl}
                          alt={`Slide ${index + 1}`}
                          className={index === currentImage ? 'active' : ''}
                      />
                  ))}
              </div>

              {/*<img*/}
              {/*    src={heroImage}*/}
              {/*    alt="Covering 3/4 page"*/}
              {/*    className={styles.coverImage}*/}
              {/*/>*/}
              <div className={styles.textOverlay}>
                  <p className={styles.disclaimer}>
                      This website is a term project exercise for WPI CS 3733 Software
                      Engineering (Prof. Wong) and is not to be confused with the actual
                      Brigham & Women’s Hospital website
                  </p>
              </div>
          </div>
          <div className={styles.textContainer}>

              <br/>
              <br/>
              <h1 className={styles.heading}>Brigham and Women's Hospital</h1>
              <br/>
              <p className={styles.heading2}>
                  Helping our patients and their families get back to what matters
                  most.
              </p>
              <br/>
              <Button
                  onClick={navigateMap}
                  color="primary"
                  style={{
                      backgroundImage: `url(${mapImage})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      width: "200px", // Adjust button width as needed
                      height: "200px", // Adjust button height as needed
                  }}
              >
            <span
                style={{color: "black", fontSize: "18px", marginTop: "150px"}}
            >
              View Map
            </span>
              </Button>
          </div>
      </div>
    </div>
  );
};

export default Login;
