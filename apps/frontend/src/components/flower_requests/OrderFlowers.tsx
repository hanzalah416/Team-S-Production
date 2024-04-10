// OrderFlowers.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./OrderFlowers.module.css";
//import { useFormData } from "./useFormData";
//import {Simulate} from "react-dom/test-utils";
//import submit = Simulate.submit;
import { flowerform } from "../common/flowerform.ts";
import axios from "axios";

const OrderFlowers: React.FC = () => {
  const [patientName, setPatientName] = useState("");
  const [patientRoom, setPatientRoom] = useState("");
  const [customMessage, setCustomMessage] = useState("");

  const navigate = useNavigate();
  //const { formData, setFormData } = useFormData();

  /*const handleReviewOrder = () => {
      setFormData({
        ...formData,
        orderFlowers: {
          patientName,
          patientRoom,
          customMessage,
        },
      });
      navigate("/order-flowers-result");
    };*/

  async function submit() {
    if (patientName == "" || patientRoom == "") {
      alert("Please Fill out the Patient Name and Room Number");
      return;
    }

    const orderFlowerSent: flowerform = {
      patientName: patientName,
      PatientRoom: parseInt(patientRoom),
      customMessage: customMessage,
    };
    console.log(orderFlowerSent);

    await axios
      .post("/api/flower-request", orderFlowerSent, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(() => {
        console.log("Order sent successfully");
        navigate("/order-flowers-result");
      })
      .catch(() => {
        console.log("Order failed to send");
        alert("Order failed to send. Please try again later.");
      });
  }

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
              type="number"
              value={patientRoom}
              onKeyDown={(e) =>
                (e.keyCode === 69 || e.keyCode === 190) && e.preventDefault()
              }
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
            onClick={submit}
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrderFlowers;
