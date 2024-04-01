// OrderPayment.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './OrderPayment.module.css';
import { useFormData } from './useFormData';

const OrderPayment: React.FC = () => {
    const [cardNumber, setCardNumber] = useState('');
    const [cvv, setCvv] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [nameOnCard, setNameOnCard] = useState('');

    const navigate = useNavigate();
    const { formData, setFormData } = useFormData();

    const handleContinue = () => {
        setFormData({
            ...formData,
            orderPayment: {
                cardNumber,
                cvv,
                expirationDate,
                nameOnCard,
            },
        });
        navigate('/order-flowers-result'); // Navigate to the display data page
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        // Here you would handle the submission of the payment form
        // Maybe sending the data to your server or processing the payment
    };

    const handleBack = () => {
        // You may want to validate or process data here before navigating
        navigate('/order-flowers');
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Payment Information</h2>
            <form onSubmit={handleSubmit}>
                {/* Card Number Input */}
                <div className={`${styles.formGroup} ${styles.cardNumberGroup}`}>
                    <label className={styles.label}>Credit Card Number</label>
                    <input
                        className={styles.input}
                        type="number"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="0000 0000 0000 0000"
                        min="0"
                        max="9999999999999999"
                        step="1"
                    />
                </div>

                {/* CVV and Expiration Date Inputs Inline */}
                <div className={styles.inputRow}>
                    {/* CVV Input */}
                    <div className={`${styles.formGroup} ${styles.cvvGroup}`}>
                        <label className={styles.label}>CVV</label>
                        <input
                            className={styles.input}
                            type="number"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value)}
                            placeholder="123"
                        />
                    </div>
                    {/* Expiration Date Input */}
                    <div className={`${styles.formGroup} ${styles.expirationDateGroup}`}>
                        <label className={styles.label}>Expiration Date</label>
                        <input
                            className={styles.input}
                            type="text"
                            value={expirationDate}
                            onChange={(e) => setExpirationDate(e.target.value)}
                            placeholder="MM/DD"
                        />
                    </div>
                </div>


                {/* Name on Card Input */}
                <div className={`${styles.formGroup} ${styles.nameOnCardGroup}`}>
                    <label className={styles.label}>Name on Card</label>
                    <input
                        className={styles.input}
                        type="text"
                        value={nameOnCard}
                        onChange={(e) => setNameOnCard(e.target.value)}
                        placeholder="John Doe"
                    />
                </div>


                {/* Button Group */}
                <div className={styles.buttonGroup}>
                    <button className={`${styles.button} ${styles.backButton}`} type="button" onClick={handleBack}>
                        Back
                    </button>
                    <button className={`${styles.button} ${styles.reviewButton}`} type="button" onClick={handleContinue}>
                        Review Order
                    </button>
                </div>
            </form>
        </div>
    );
};

export default OrderPayment;
