import React, { useState } from "react";
import { subscribeEmail } from "./EmailApi.ts"; // Import the SNS subscription function
import { DataGrid, GRID_CHECKBOX_SELECTION_COL_DEF } from '@mui/x-data-grid';



interface EmailFormProps {
    topicArn: string;
}

const EmailForm: React.FC<EmailFormProps> = ({ topicArn }) => {
    const [email, setEmail] = useState("");
    const rows = [
        { id: 1, serviceRequestName: 'Order Flowers', status: 'Working' },
        { id: 2, serviceRequestName: 'Gift Requests', status: 'Working' },
        { id: 3, serviceRequestName: 'Medical Delivery', status: 'Working' },
        { id: 4, serviceRequestName: 'Sanitation Services', status: 'Working' },
        { id: 5, serviceRequestName: 'Security Requests', status: 'Working' },
        { id: 6, serviceRequestName: 'Room Scheduling', status: 'Working' },
        { id: 7, serviceRequestName: 'Language Request', status: 'Working' },
        { id: 8, serviceRequestName: 'Transportation Request', status: 'Working' },

    ];
    const columns = React.useMemo(
        () => [
            {
                field: 'serviceRequestName',
                headerName: 'ServiceRequest Name',
                width: 300,
            },
            {
                field: 'status',
                headerName: 'Status',
                width: 150,
            },
            {
                ...GRID_CHECKBOX_SELECTION_COL_DEF,
                width: 50,
            },
        ],
        [],
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await subscribeEmail(topicArn, email);
            alert("Subscription successful!");
            setEmail("");
        } catch (error) {
            console.error("Error subscribing email:", error);
            alert("Subscription failed. Please try again.");
        }
    };

    return (

        <form onSubmit={handleSubmit}>
            <div style={{height: 400, width: '100%'}}>
                <DataGrid rows={rows} columns={columns} checkboxSelection />
            </div>
            <label htmlFor="emailInput">Enter Email:</label>
            <input
                type="email"
                id="emailInput"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <button type="submit">Subscribe</button>
        </form>
    );
};

export default EmailForm;
