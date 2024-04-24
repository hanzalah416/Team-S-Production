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
import { useEffect, useState } from "react";
import HeroPageCard from "./HeroPageCard";
import flowerIcon from "../assets/NavBarIcons/flowers_icon.svg";
import mapIcon from "../assets/NavBarIcons/map_icon.svg";
import aboutIcon from "../assets/NavBarIcons/about.svg";
import giftIcon from "../assets/NavBarIcons/gift_icon.svg";
import toolsIcon from "../assets/NavBarIcons/tools_icon.svg";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigateMap = () => {
    navigate("/floor-map");
  };

  const images = [heroImage, heroImage1, heroImage2, heroImage3];

  useEffect(() => {
    const interval = setInterval(() => {
      // Update the index to display the next image
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change the duration here (in milliseconds)

    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, [images.length]); // Empty dependency array to run this effect only once on component mount

  return (
    <div className={styles.down}>
      <div className={styles.container}>
        <div className={styles.imageContainer}>
          <div className={styles.slideshow}>
            {images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Slide ${index}`}
                className={styles.coverImage}
                style={{
                  display: index === currentImageIndex ? "block" : "none",
                  transition: "opacity 5s ease-out",
                }}
              />
            ))}
          </div>

          <div className={styles.textOverlay}>
            <p className={styles.disclaimer}>
              This website is a term project exercise for WPI CS 3733 Software
              Engineering (Prof. Wong) and is not to be confused with the actual
              Brigham & Women’s Hospital website
            </p>
          </div>
        </div>
        <div className={styles.textContainer}>
          <h1 className={styles.heading}>Brigham and Women's Hospital</h1>
          <br />
          <p className={styles.heading2}>
            Helping our patients and their families get back to what matters
            most.
          </p>
          <br />
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
              style={{ color: "black", fontSize: "18px", marginTop: "150px" }}
            >
              View Map
            </span>
          </Button>
        </div>
      </div>
      <div className={styles.bottomHalfContainer}>
        <div className={styles.lightBlueBar} />
        <div className={styles.cardsAligned}>
          <HeroPageCard
            image={flowerIcon}
            title={"Order some flowers"}
            link={"order-flowers"}
          />
          <HeroPageCard
            image={mapIcon}
            title={"Visit Our Map"}
            link={"floor-map"}
          />
          <HeroPageCard
            image={giftIcon}
            title={"Order a gift"}
            link={"gift-request"}
          />
          <HeroPageCard
            image={aboutIcon}
            title={"About this site"}
            link={"about-page"}
          />
          <HeroPageCard
            image={toolsIcon}
            title={"Tools Used"}
            link={"credit-page"}
          />
        </div>
        <div className={styles.footer}>
          <p>
            This website is a term project exercise for WPI CS 3733 Software
            Engineering (Prof. Wong) and is not to be confused with the actual
            Brigham & Women’s Hospital website
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
