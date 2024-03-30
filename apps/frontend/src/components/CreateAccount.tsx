
// import {Link} from "react-router-dom";
import React, {useState} from "react";
import styles from "./CreateAccount.module.css";
import {useNavigate} from "react-router-dom";

const CreateAccount: React.FC = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordAgain, setPasswordAgain] = useState('');
    const navigate = useNavigate();
    const handleBack = () => {
        // You may want to validate or process data here before navigating
        navigate('/');
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        // Here you would handle the submission of the payment form
        // Maybe sending the data to your server or processing the payment
    };

    const handleCreateAccount = () => {
        // You may want to validate or process data here before navigating
        if (isSamePasswords() && password!= "" && passwordAgain!= "" && username!= "" && email!= "" ){
            navigate('/welcome');
        } else {
            throw new Error("Passwords don't match");

        }

    };

    const isSamePasswords = (): boolean => {
        return (passwordAgain == password);

    };

    return (
        <div className = {styles.container}>
            <h2 className={styles.title}>Create Account</h2>
            <form onSubmit = {handleSubmit}>
                <div className={styles.formGroup}>
                    <input
                        className={styles.input}
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                    />
                </div>
                <div className={styles.formGroup}>
                    <input
                        className={styles.input}
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                    />
                </div>

                <div className={styles.formGroup}>
                    <input
                        className={styles.input}
                        type="text"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                    />
                </div>
                <div className={styles.formGroup}>
                    <input
                        className={styles.input}
                        type="text"
                        value={passwordAgain}
                        onChange={(e) => setPasswordAgain(e.target.value)}
                        placeholder="Retype Password"
                    />
                </div>


            </form>
            <div className={styles.buttonGroup}>
                <button className={`${styles.button} ${styles.backButton}`} type="button" onClick={handleBack}>
                   Back
                </button>
                <button className={`${styles.button} ${styles.reviewButton}`} type="button" onClick={handleCreateAccount}>
                   Create Account
                </button>


            </div>
        </div>
    );
};
export default CreateAccount;
