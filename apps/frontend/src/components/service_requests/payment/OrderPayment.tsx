// OrderPayment.tsx
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import styles from "./OrderPayment.module.css";
// import { useFormData } from "../../common/useFormData.ts";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import InputLabel from "@mui/material/InputLabel";
// import { Grid } from "react-bootstrap";
import TextField from "@mui/material/TextField";
import {Grid, Select} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
// import Autocomplete from "@mui/material/Autocomplete";
// import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
// import ToggleButton from "@mui/material/ToggleButton";
// import FormLabel from "@mui/material/FormLabel";
import Button from "@mui/material/Button";
import {useState} from "react";
import {useNavigate} from "react-router-dom";

const OrderPayment: React.FC = () => {
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [expirationMonth, setExpirationMonth] = useState("");
    const [expirationYear, setExpirationYear] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const navigate = useNavigate();
  // const { formData, setFormData } = useFormData();

    async function submit() {
        if (
            cardNumber == "" ||
            cvv == "" ||
            expirationMonth == "" ||
           expirationYear == "" ||
            nameOnCard == ""
        ) {
            alert("Please fill out all information on the page");

        } else {
        navigate('order-flowers-result');
        }
    }


  const handleBack = () => {
    navigate("/order-flowers");
  };




    return (
    <Grid
        container
        spacing={5}
        direction="column"
        alignItems="center"
        justifyContent="center"
        my={4}
    >
        <br />
        <br />

        <Paper elevation={4}>
            <br />
            <p className={"title"}>Payment Information </p>

            <Stack alignItems="center" justifyContent="center" spacing={3} p={4}>
                <div>
                    <InputLabel
                        style={{
                            color: "#3B54A0",
                        }}
                    >
                        Card Number input
                    </InputLabel>
                    <TextField
                        className="text-center"
                        type="number"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="0000 0000 0000 0000"
                        max="9999999999999999"
                        step="1"
                        sx={{ minWidth: 400 }}
                    />
                </div>
                <div>
                    <InputLabel
                        style={{
                            color: "#3B54A0",
                        }}
                        id="priority-dropdown"
                    >
                       Expiration Date
                    </InputLabel>
                    <Stack
                        spacing={1}
                        direction="row"
                        alignItems="center"
                        justifyContent="center"
                    >
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label=""
                        value={expirationMonth}
                        onChange={(e) => setExpirationMonth(e.target.value)}
                        sx={{ minWidth: 200 }}

                    >
                        <MenuItem value={"unassigned"}>January</MenuItem>
                        <MenuItem value={"assigned"}>February</MenuItem>
                        <MenuItem value={"in_progress"}>March</MenuItem>
                        <MenuItem value={"closed"}>April</MenuItem>
                        <MenuItem value={"unassigned"}>May</MenuItem>
                        <MenuItem value={"assigned"}>June</MenuItem>
                        <MenuItem value={"in_progress"}>July</MenuItem>
                        <MenuItem value={"closed"}>August</MenuItem>
                        <MenuItem value={"unassigned"}>September</MenuItem>
                        <MenuItem value={"assigned"}>October</MenuItem>
                        <MenuItem value={"in_progress"}>November</MenuItem>
                        <MenuItem value={"closed"}>December</MenuItem>
                    </Select>
                    <TextField
                        value={expirationYear}
                        onChange={(e) => setExpirationYear(e.target.value)}
                        label="Year"
                        sx={{ minWidth: 150 }}
                    />
                    </Stack>
                </div>

                <div>
                <Stack
                    spacing={1}
                    direction="row"
                >
                    <div>
                        <InputLabel
                            style={{
                                color: "#3B54A0",
                            }}
                            id="priority-dropdown"
                        >
                            Name on Card
                        </InputLabel>
                        <TextField

                            value={nameOnCard}
                            onChange={(e) => setNameOnCard(e.target.value)}
                            sx={{minWidth: 200}}
                        />
                    </div>
                    <div>
                        <InputLabel
                            style={{
                                color: "#3B54A0",
                            }}
                            id="priority-dropdown"
                        >
                            CVV
                        </InputLabel>
                        <TextField
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value)}
                            sx={{minWidth: 100}}
                        />

                    </div>
                </Stack>
                </div>




                <Stack
                    spacing={2}
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Button
                        style={{
                            color: "#3B54A0",
                            outlineColor: "#3B54A0",
                            borderColor: "#3B54A0",
                        }}
                        variant="outlined"
                        sx={{ minWidth: 100 }}
                        onClick={handleBack}
                    >
                       Back
                    </Button>

                    <Button
                        style={{
                            backgroundColor: "#3B54A0",
                        }}
                        variant="contained"
                        sx={{ minWidth: 100 }}
                        onClick={submit}
                    >
                        Submit
                    </Button>
                </Stack>
            </Stack>
        </Paper>
    </Grid>
);
};

export default OrderPayment;
