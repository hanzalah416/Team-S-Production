// OrderFlowersResult.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './OrderFlowers.module.css';
import { useFormData } from './useFormData';

const OrderFlowersResult: React.FC = () => {
    const navigate = useNavigate();
    const { formData } = useFormData();

    const handleBack = () => {
        navigate('/payment-info');
    };


    const handleSendOrder = () => {
        navigate('/display-data'); // Navigate to the display form data page
    };


    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Order Flowers Result</h2>
            <div>
                <div className={styles.inputRow}>
                    <div className={styles.formGroup}>
                        <label className={`${styles.label} ${styles.boldLabel}`}>Patient Name</label>
                        <div className={styles.result}>{formData.orderFlowers.patientName}</div>
                    </div>
                    <div className={styles.formGroup}>
                        <label className={`${styles.label} ${styles.boldLabel}`}>Patient Room</label>
                        <div className={styles.result}>{formData.orderFlowers.patientRoom}</div>
                    </div>
                </div>
                <div className={styles.formGroup}>
                    <label className={`${styles.label} ${styles.boldLabel}`}>Custom Message</label>
                    <div className={`${styles.result} ${styles.largeTextarea}`}>
                        {formData.orderFlowers.customMessage}
                    </div>
                </div>

                <div className={styles.buttonGroup}>
                    <button className={`${styles.button} ${styles.backButton}`} type="button" onClick={handleBack}>
                        Back
                    </button>
                    <button className={`${styles.button} ${styles.reviewButton}`} type="button" onClick={handleSendOrder}>
                        Send Order
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderFlowersResult;
