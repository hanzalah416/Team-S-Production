import React from "react";
import styles from "../flower_requests/OrderFlowers.module.css";
import checkMark from "../assets/checkmark.webp";

export default function OrderConfirmation() {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Order Flowers</h2>
      <h4 className={styles.result}>Success!</h4>
      <img src={checkMark} alt="Confirmation Checkmark" />
    </div>
  );
}
