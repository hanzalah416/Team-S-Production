import React from "react";
import styles from "../flower_requests/OrderFlowers.module.css";
import checkMark from "../assets/checkmark.webp";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import BackgroundImg2 from "../assets/blue-background2.jpg";
export default function OrderConfirmation() {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate("/floor-map");
  };

  return (
    <div
      style={{
        backgroundImage: `url(${BackgroundImg2})`,
        height: "100vh",
        width: "100vw",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        minHeight: "100%",
        backgroundPosition: "center center",
        overflowX: "hidden",
        display: "flex",
        flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center"
      }}
    >
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        "& > :not(style)": {
          m: 10,
          width: 700,
          height: 760,
        },
      }}
    >
      <Paper elevation={3}>
        <br/>
        <br/>
        <h2 className={styles.title}>Request Confirmation</h2>
        <p className={styles.result}>
          Request placed! Awaiting staff assignment.
        </p>
        <img
          className={styles.check}
          src={checkMark}
          alt="Confirmation Checkmark"
        />
        <div className={styles.buttonReturn}>
          <Button
            style={{
              backgroundColor: "#3B54A0",
            }}
            variant="contained"
            onClick={handleBack}
            sx={{ minWidth: 300, minHeight: 50, fontSize:18 }}
          >
            Back
          </Button>
        </div>
      </Paper>
    </Box>
  </div>
  );
}
