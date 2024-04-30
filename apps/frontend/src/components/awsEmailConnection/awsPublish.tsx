import React, { useState } from "react";
import axios from "axios";
import Grid from "@mui/material/Unstable_Grid2";
import Paper from "@mui/material/Paper";
import BackgroundImg2 from "../assets/blue-background2.jpg";
import Tooltip from "../ToolTip.tsx";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import {InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";

const tips = `
This message will be sent to every person who subscribes to the hospital. \n Only do this if there is an important message to send.
`;

export default function AwsPublishForm() {
  const [message, setMessage] = useState("");
  const [topicArn, setTopicArn] = useState("");
  const navigate = useNavigate();

  const handleChangeTopicArn = (event: SelectChangeEvent) => {
    setTopicArn(event.target.value as string);
  };
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const newEntry = {
      message: message,
      topicArn: topicArn,
    };

    await axios
      .post("/api/publish-message", newEntry, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(() => {
        console.log("Successfully published message");
        navigate("/floor-map");
      })
      .catch(() => {
        console.log("Failed to publish");
        alert("Message failed to publish");
      });
    clear();
  }

  function clear() {
    setMessage("");
  }

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
        my={4}
      >
        <br />
        <br />
        <Paper elevation={4} style={{ padding: 20, width: "60%" }}>
          <br />
          <p className={"title"} style={{ position: "relative" }}>
            Send Out Emails to Patients
            <Tooltip
              style={{ position: "absolute", right: "20px", top: 0 }}
              tips={tips}
            />
          </p>

          <Stack alignItems="center" justifyContent="center" spacing={3} p={4}>
            <div className={"breakline"}></div>
            <br />
            <Stack
              spacing={2}
              direction="row"
              alignItems="center"
              justifyContent="center"
            >
              <form onSubmit={submit} style={{width: "100%"}}>
                <div>
                  <InputLabel
                      style={{
                        color: "#3B54A0",
                        fontStyle: "italic",
                      }}
                      id="demo-simple-select-label"
                  >
                    Topic
                  </InputLabel>
                  <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={topicArn}
                      label=""
                      onChange={(e) => {
                        handleChangeTopicArn(e);
                      }}
                      sx={{minWidth: 250}}
                  >
                    <MenuItem value={"arn:aws:sns:us-east-2:851725475476:Appointment_Confirmation"}>
                      Appointment Confirmation</MenuItem>
                    <MenuItem value={"arn:aws:sns:us-east-2:851725475476:Appointment_Reminder"}>
                      Appointment Reminder</MenuItem>
                    <MenuItem value={"arn:aws:sns:us-east-2:851725475476:Brigham_Alerts"}>
                      Alerts from Brigham's Hospital</MenuItem>
                    <MenuItem value={"arn:aws:sns:us-east-2:851725475476:Brigham_Updates"}>
                      Updates from Brigham's Hospital</MenuItem>
                    <MenuItem value={"arn:aws:sns:us-east-2:851725475476:Follow-Up"}>
                      Follow Up Emails</MenuItem>
                    <MenuItem value={"arn:aws:sns:us-east-2:851725475476:Medicine_Magazine"}>
                      Brigham's Medicine Magazine</MenuItem>
                  </Select>
                </div>
                <div>
                <label htmlFor="messageInput">Enter Message:</label>
                <TextField
                    id="messageInput"
                    label="Message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    fullWidth
                    multiline
                    rows={6}
                    style={{width: "100%"}} // Set the width of the TextField
                />
                </div>
                <button type="submit">Send to Subscribers</button>
              </form>
            </Stack>
          </Stack>
        </Paper>
      </Grid>
    </div>
  );
}
