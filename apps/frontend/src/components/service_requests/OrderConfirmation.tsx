import React from "react";
import styles from "../flower_requests/OrderFlowers.module.css";
import checkMark from "../assets/checkmark.webp";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { useNavigate } from "react-router-dom";

export default function OrderConfirmation() {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate("/welcome");
  };

  return (
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
        <h2 className={styles.title}>Order Flowers</h2>
        <p className={styles.result}>
          Request placed! Awaiting staff assignment.
        </p>
        <img
          className={styles.check}
          src={checkMark}
          alt="Confirmation Checkmark"
        />
        <div className={styles.buttonReturn}>
          <button
            className={`${styles.button} ${styles.reviewButton}`}
            type="button"
            onClick={handleBack}
          >
            Go Back
          </button>
        </div>
      </Paper>
    </Box>
  );
}
