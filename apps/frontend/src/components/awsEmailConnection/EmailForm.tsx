import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import BackgroundImg2 from "../assets/blue-background2.jpg";
import { Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Unstable_Grid2";
import { Typography } from "@mui/material";
import axios from "axios";

export default function EmailForm() {
  const [email, setEmail] = useState("");
  const [topicArn, setTopicArn] = useState("");
  const rows = [
    {
      id: 1,
      serviceRequestName: "Appointment Confirmation",
      status: "Working",
      TopicArn: "arn:aws:sns:us-east-2:851725475476:Appointment_Confirmation",
      info: "Get email updates whenever you make an appointment with us!",
    },
    {
      id: 2,
      serviceRequestName: "Appointment Reminder",
      status: "Working",
      TopicArn: "arn:aws:sns:us-east-2:851725475476:Appointment_Reminder",
      info: "Get a reminder a day before your appointment with us!",
    },
    {
      id: 3,
      serviceRequestName: "Alerts from Brigham's Hospital",
      status: "Working",
      TopicArn: "arn:aws:sns:us-east-2:851725475476:Brigham_Alerts",
      info: "Get any urgent alerts related to Brigham's Hospital",
    },
    {
      id: 4,
      serviceRequestName: "Updates from Brigham's Hospital",
      status: "Working",
      TopicArn: "arn:aws:sns:us-east-2:851725475476:Brigham_Updates",
      info: "Get emailed with any new updates related to Brigham's Hospital",
    },
    {
      id: 5,
      serviceRequestName: "Follow Up Emails",
      status: "Working",
      TopicArn: "arn:aws:sns:us-east-2:851725475476:Follow-Up",
      info: "Get emails after your appointment with any helpful information",
    },
    {
      id: 6,
      serviceRequestName: "Brigham's Medicine Magazine",
      status: "Working",
      TopicArn: "arn:aws:sns:us-east-2:851725475476:Medicine_Magazine",
      info: "Get emails with our own magazine detailing the newest medicine discoveries!",
    },
  ];
  const navigate = useNavigate();
  const columns = React.useMemo(
    () => [
      {
        field: "serviceRequestName",
        headerName: "ServiceRequest Name",
        width: 300,
      },
      {
        field: "info",
        headerName: "Information",
        width: 520,
      },
    ],
    [],
  );

  function clear() {
    setEmail("");
    setTopicArn("");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const emailTopic = {
      email: email,
      TopicArn: "arn:aws:sns:us-east-2:851725475476:Brighams-Hospital",
    };

    await axios
      .post("/api/subscribe-email", emailTopic, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(() => {
        console.log("Email Subscribed successfully");
        navigate("/");
        console.log(topicArn);
      })
      .catch(() => {
        console.log("Subscription failed failed");
        console.log(emailTopic);
        alert("Subscription failed. Please try again.");
      });
    clear();
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
        style={{ minHeight: "100vh" }}
      >
        <Paper
          style={{
            padding: 55,
            width: 1000,
            maxWidth: "90%",
            margin: "20px auto",
            marginTop: "5%",
          }}
        >
          <Typography
            variant="h4"
            style={{ textAlign: "center", marginBottom: 20 }}
          >
            List of Subscription Services
          </Typography>
          <form onSubmit={handleSubmit}>
            <div style={{ height: 439, width: "100%" }}>
              <DataGrid rows={rows} columns={columns} />
            </div>
            <label
              htmlFor="emailInput"
              style={{ display: "block", margin: "20px 0 10px" }}
            >
              Enter Email:
            </label>
            <input
              type="email"
              id="emailInput"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px 15px",
                fontSize: "16px",
                border: "1px solid rgba(0, 0, 0, 0.23)",
                boxShadow:
                  "0px 4px 6px -1px rgba(0,0,0,0.25), 0px 2px 4px -1px rgba(0,0,0,0.22)",
                backgroundColor: "#fff",
              }}
            />
            <button
              type="submit"
              style={{
                padding: "10px 20px",
                fontSize: "16px",
                marginTop: "10px",
              }}
            >
              Subscribe
            </button>
          </form>
        </Paper>
      </Grid>
    </div>
  );
}
