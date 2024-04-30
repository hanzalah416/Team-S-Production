import React, { useState } from "react";
import {
  DataGrid,
  GRID_CHECKBOX_SELECTION_COL_DEF,
  GridRowId,
} from "@mui/x-data-grid";
import BackgroundImg2 from "../assets/blue-background2.jpg";
import { Button, InputLabel, Paper, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Unstable_Grid2";
import axios from "axios";

export default function EmailForm() {
  const [email, setEmail] = useState("");
  const [topicArn, setTopicArn] = useState("");
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([]);
  const handleSelectionModelChange = (newSelection: GridRowId[]) => {
    setSelectedRows(newSelection);
  };

  const rows = [
    {
      id: 1,
      serviceRequestName: "Appointment Confirmation",
      status: "Working",
      TopicArn: "arn:aws:sns:us-east-2:851725475476:Appointment_Confirmation",
    },
    {
      id: 2,
      serviceRequestName: "Appointment Reminder",
      status: "Working",
      TopicArn: "arn:aws:sns:us-east-2:851725475476:Appointment_Reminder",
    },
    {
      id: 3,
      serviceRequestName: "Alerts from Brigham's Hospital",
      status: "Working",
      TopicArn: "arn:aws:sns:us-east-2:851725475476:Brigham_Alerts",
    },
    {
      id: 4,
      serviceRequestName: "Updates from Brigham's Hospital",
      status: "Working",
      TopicArn: "arn:aws:sns:us-east-2:851725475476:Brigham_Updates",
    },
    {
      id: 5,
      serviceRequestName: "Follow Up Emails",
      status: "Working",
      TopicArn: "arn:aws:sns:us-east-2:851725475476:Follow-Up",
    },
    {
      id: 6,
      serviceRequestName: "Brigham's Medicine Magazine",
      status: "Working",
      TopicArn: "arn:aws:sns:us-east-2:851725475476:Medicine_Magazine",
    },
  ];
  const navigate = useNavigate();
  const columns = React.useMemo(
    () => [
      {
        field: "serviceRequestName",
        headerName: "Notification Type",
        width: 300,
      },
      {
        field: "status",
        headerName: "Status",
        width: 150,
      },
      {
        ...GRID_CHECKBOX_SELECTION_COL_DEF,
        width: 50,
      },
    ],
    [],
  );

  function clear() {
    setEmail("");
    setTopicArn("");
  }

  async function handleSubmitMultiple() {
    console.log(selectedRows);

    if (selectedRows.length == 0) {
      alert("Please choose at least one topic to subscribe to");
      return;
    }
    if (email.length == 0) {
      alert("Please enter an email");
      return;
    }
    selectedRows.forEach(function (x) {
      handleSubmit(x);
    });
  }

  async function handleSubmit(x: GridRowId) {
    const num_x = Number(x);
    const emailTopic = {
      email: email,
      TopicArn: rows[num_x - 1].TopicArn,
    };

    await axios
      .post("/api/subscribe-email", emailTopic, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(() => {
        console.log("Email Subscribed successfully");
        navigate("/subscription-result");
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
        my={4}
      >
        <br />
        <br />
        <Paper elevation={4} style={{ padding: 20 }}>
          <br />
          <p className={"title"} style={{ position: "relative" }}>
            Subscribe to Emails
          </p>
          <Stack alignItems="center" justifyContent="center" spacing={3} p={4}>
            <div className={"breakline"}></div>
            <br />
            <div style={{ height: 400, width: "100%" }}>
              <InputLabel
                style={{
                  color: "#3B54A0",
                  fontStyle: "italic",
                }}
                id="demo-f-select-label"
              >
                Topics for subscription:
              </InputLabel>
              <DataGrid
                rows={rows}
                columns={columns}
                checkboxSelection
                rowSelectionModel={selectedRows}
                onRowSelectionModelChange={handleSelectionModelChange}
              />
            </div>
            <br />
            <div>
              <InputLabel
                style={{
                  color: "#3B54A0",
                  fontStyle: "italic",
                }}
                id="demo-simple-select-label"
              >
                Enter E-mail:
              </InputLabel>
              <input
                id="email"
                value={email}
                type="email"
                required
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "500px",
                  height: "50px",
                  backgroundColor: "white",
                  border: "1px solid black",
                  padding: "10px",
                  color: "black",
                }} // Set the width of the TextField
              />
            </div>
            <div>
              <Button
                style={{
                  backgroundColor: "#3B54A0",
                }}
                variant="contained"
                sx={{ minWidth: 150, fontFamily: "Jaldi", fontSize: 20 }}
                onClick={handleSubmitMultiple}
              >
                Subscribe
              </Button>
            </div>
            <br />
          </Stack>
        </Paper>
      </Grid>
    </div>
  );
}
