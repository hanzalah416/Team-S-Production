// OrderFlowersResult.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./OrderFlowers.module.css";
import { FlowerRequestGetter } from "./FlowerRequests/FlowerRequestGetter";

const OrderFlowersResult: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/payment-info");
  };

  const handleSendOrder = () => {
    navigate("/display-data"); // Navigate to the display form data page
  };

  return (
    <div>
      <div>
        <FlowerRequestGetter />
        <p>I AM HERE</p>
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
          onClick={handleSendOrder}
        >
          Send Order
        </button>
      </div>
    </div>
  );
};

export default OrderFlowersResult;
