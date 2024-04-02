// OrderFlowers.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./OrderFlowers.module.css";
import { useFormData } from "./useFormData";

const OrderFlowers: React.FC = () => {
  const [patientName, setPatientName] = useState("");
  const [patientRoom, setPatientRoom] = useState("");
  const [customMessage, setCustomMessage] = useState("");

  const navigate = useNavigate();
  const { formData, setFormData } = useFormData();

  const handleReviewOrder = () => {
    setFormData({
      ...formData,
      orderFlowers: {
        patientName,
        patientRoom,
        customMessage,
      },
    });
    navigate("/payment-info");
  };

  const handleBack = () => {
    navigate("/welcome");
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Order Flowers</h2>
      <form>
        <div className={styles.inputRow}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Patient Name</label>
            <input
              className={styles.input}
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="Add Name Here"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Patient Room</label>
            <input
              className={styles.input}
              type="text"
              value={patientRoom}
              onChange={(e) => setPatientRoom(e.target.value)}
              placeholder="Room Number Here"
            />
          </div>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Custom Message (optional)</label>
          <textarea
            className={`${styles.input} ${styles.largeTextarea}`}
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder="Add your message Here"
          />
        </div>

        <div className={styles.buttonGroup}>
          <button
            className={`${styles.button} ${styles.backButton}`}
            type="button"
            onClick={handleBack}
          >
            Back
          </button>
          <button
            className={`${styles.button} ${styles.reviewButton}`}
            type="button"
            onClick={handleReviewOrder}
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrderFlowers;
