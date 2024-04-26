import React, { useState } from "react";
import { subscribeEmail } from "./EmailApi.ts"; // Import the SNS subscription function
import { DataGrid, GRID_CHECKBOX_SELECTION_COL_DEF } from '@mui/x-data-grid';
import BackgroundImg2 from "../assets/blue-background2.jpg";
import { Paper } from '@mui/material';
import Grid from "@mui/material/Unstable_Grid2";
import { Typography } from '@mui/material';
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
        <div
            style={{
                backgroundImage: `url(${BackgroundImg2})`,
                height: "100vh",
                width: "100vw",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                minHeight: "100%",
                backgroundPosition: "center center",
                overflowX: "hidden",
            }}
        >
            <Grid
                container
                spacing={5}
                direction="column"
                alignItems="center"
                justifyContent="center"
                style={{ minHeight: "100vh" }}
            >
                <Paper style={{ padding: 30, width: "50%", maxWidth: 800, margin: '20px auto', marginTop: '5%' }}>
                    <Typography variant="h5" style={{ textAlign: 'center', marginBottom: 20 }}>Subscirbe Service Requests</Typography>
                    <form onSubmit={handleSubmit}>
                        <div style={{ height: 400, width: '100%' }}>
                            <DataGrid rows={rows} columns={columns} checkboxSelection />
                        </div>
                        <label htmlFor="emailInput" style={{ display: 'block', margin: '20px 0 10px' }}>Enter Email:</label>
                        <input
                            type="email"
                            id="emailInput"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '10px 15px',
                                fontSize: '16px',
                                border: '1px solid rgba(0, 0, 0, 0.23)',
                                boxShadow: '0px 4px 6px -1px rgba(0,0,0,0.25), 0px 2px 4px -1px rgba(0,0,0,0.22)',
                                backgroundColor: '#fff'
                            }}
                        />
                        <button type="submit" style={{ padding: '10px 20px', fontSize: '16px', marginTop: '10px' }}>Subscribe</button>
                    </form>
                </Paper>
            </Grid>
        </div>
    );
};

export default EmailForm;
