import BackgroundImg2 from "../assets/blue-background2.jpg";
import React, { useState } from "react";
import {
  DataGrid,
  GRID_CHECKBOX_SELECTION_COL_DEF,
  GridRowId,
} from "@mui/x-data-grid";
import { Button, InputLabel, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../AllMobile.css";

const MobileEmail = () => {
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
      info: "Confirmation that your appointment was scheduled",
    },
    {
      id: 2,
      serviceRequestName: "Appointment Reminder",
      status: "Working",
      TopicArn: "arn:aws:sns:us-east-2:851725475476:Appointment_Reminder",
      info: "Get reminded before your appointment",
    },
    {
      id: 3,
      serviceRequestName: "Alerts from Brigham's Hospital",
      status: "Working",
      TopicArn: "arn:aws:sns:us-east-2:851725475476:Brigham_Alerts",
      info: "Urgent alerts related to Brigham's Hospital",
    },
    {
      id: 4,
      serviceRequestName: "Updates from Brigham's Hospital",
      status: "Working",
      TopicArn: "arn:aws:sns:us-east-2:851725475476:Brigham_Updates",
      info: "New updates related to Brigham's Hospital",
    },
    {
      id: 5,
      serviceRequestName: "Follow Up Emails",
      status: "Working",
      TopicArn: "arn:aws:sns:us-east-2:851725475476:Follow-Up",
      info: "Helpful information after your appointment",
    },
    {
      id: 6,
      serviceRequestName: "Brigham's Medicine Magazine",
      status: "Working",
      TopicArn: "arn:aws:sns:us-east-2:851725475476:Medicine_Magazine",
      info: "Our magazine detailing the newest medicine discoveries",
    },
  ];
  const navigate = useNavigate();
  const columns = React.useMemo(
    () => [
      {
        field: "serviceRequestName",
        headerName: "Notification Type",
        width: 250,
      },
      {
        field: "info",
        headerName: "Information",
        width: 400,
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
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className={"mainBox"}>
        <p className={"title-mobile"} style={{ position: "relative" }}>
          Subscribe to Emails
        </p>
        <div className={"breakline"} />
        <Stack alignItems="center" justifyContent="center" spacing={3}>
          <div style={{ height: 422, width: "100%" }}>
            <InputLabel
              style={{
                color: "#3B54A0",
                fontStyle: "italic",
                fontSize: 25,
                whiteSpace: "wrap",
              }}
              id="demo-f-select-label"
            >
              Topics for subscription:
            </InputLabel>
            <br />
            <DataGrid
              rows={rows}
              columns={columns}
              checkboxSelection
              rowSelectionModel={selectedRows}
              onRowSelectionModelChange={handleSelectionModelChange}
              hideFooterPagination
              hideFooterSelectedRowCount
              hideFooter
              autoHeight
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
                width: "70vw",
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
        </Stack>
      </div>
    </div>
  );
};

export default MobileEmail;
