import React from "react";
import styles from "./OrderFlowers.module.css";

export default function OrderConfirmation() {
    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Order Flowers</h2>
            <h4 className={styles.result}>Success!</h4>
                <img src={'./assets/checkmark.webp'} alt="Confirmation Checkmark"/>
        </div>
    );
}
