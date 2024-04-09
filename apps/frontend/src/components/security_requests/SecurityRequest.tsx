// OrderFlowers.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SecurityRequest.module.css";
//import { useFormData } from "./useFormData";
//import {Simulate} from "react-dom/test-utils";
//import submit = Simulate.submit;
import { securityform } from "../common/securityform.ts";
import axios from "axios";

import {
  FormControl,
  InputLabel,
  Select,
  TextField,
  Paper,
  SelectChangeEvent,
  FormControlLabel,
  RadioGroup,
  FormLabel,
  Radio

} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";

const SecurityRequest: React.FC = () => {
  const [staffName, setStaffName] = useState("");
  const [location, setLocation] = useState("");
  const [requestPriority, setRequestPriority] = useState("");
  const [requestStatus, setRequestStatus] = useState("");
  const [securityType, setSecurityType] = useState("");
  const [threatType, setThreatType] = useState("");


  const navigate = useNavigate();
  //const { formData, setFormData } = useFormData();

  // const handleChangeStaffName = (event: SelectChangeEvent) => {
  //   setStaffName(event.target.value as string);
  // };

  const handleChangeStaffName = (event: SelectChangeEvent) => {
    setStaffName(event.target.value as string);
  };
  const handleChangeSecurityType = (event: SelectChangeEvent) => {
    setSecurityType(event.target.value as string);
  };

  const handleChangeLocation = (event: SelectChangeEvent) => {
    setLocation(event.target.value as string);
  };

  const handleChangeThreatType = (event: SelectChangeEvent) => {
    setThreatType(event.target.value as string);
  };

  const handleChangeRequestStatus = (event: SelectChangeEvent) => {
    setRequestStatus(event.target.value as string);
  };

  const handleChangeRequestPriority = (event: SelectChangeEvent) => {
    setRequestPriority(event.target.value as string);
  };


  async function submit() {
    if (staffName == "" ) {
      alert("Please Fill out the Patient Name and Room Number");
      return;
    }

    const securityRequestSent: securityform = {
      staffName: staffName,
      location: staffName,
      requestStatus: staffName,
      requestPriority: staffName,
      threatType: staffName,
      securityType: staffName
    };

    console.log(securityRequestSent);

    await axios
      .post("/api/security-request", securityRequestSent, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(() => {
        console.log("Request sent successfully");
        navigate("/order-flowers-result");
      })
      .catch(() => {
        console.log("Request failed to send");
        alert("Request failed to send. Please try again later.");
      });
  }

  const handleBack = () => {
    navigate("/welcome");
  };

  return (
    <div>
      <Paper >
      <h2 className={styles.title}>Security Request</h2>
      <form>

          <FormControl>
            <TextField id="outlined-basic" label="Staff Name" variant="outlined"
            onChange={(e) => handleChangeStaffName(e.target.value)}/>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel
                id="location-label"
                color="primary"
                htmlFor={"location-label"}
            >
              Location
            </InputLabel>
            <Select
                labelId="location-label"
                id="serviceLocation"
                label="Location"
                value={location}
                onChange = {handleChangeLocation}/* add funtion here */
                fullWidth
            >
              <MenuItem value="CCONF001L1">Anesthesia Conf Floor L1</MenuItem>
              <MenuItem value="CCONF003L1">Abrams Conference Room</MenuItem>
            </Select>
          </FormControl>

        <FormControl>
          <FormLabel id="demo-controlled-radio-buttons-group">Request Status</FormLabel>
          <RadioGroup
              row
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              value={requestStatus}
              onChange={handleChangeRequestStatus}
          >
            <FormControlLabel value="unassigned" control={<Radio />} label="Unassigned" />
            <FormControlLabel value="assigned" control={<Radio />} label="Assigned" />
            <FormControlLabel value="in_progress" control={<Radio />} label="In Progress" />
            <FormControlLabel value="closed" control={<Radio />} label="Closed" />

          </RadioGroup>
        </FormControl>
        <br/>
        <FormControl>
          <FormLabel id="demo-controlled-radio-buttons-group">Request Priority</FormLabel>
          <RadioGroup
              row
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="other"
              value={requestPriority}
              onChange={handleChangeRequestPriority}
          >
            <FormControlLabel value="low" control={<Radio />} label="Low" />
            <FormControlLabel value="medium" control={<Radio />} label="Medium" />
            <FormControlLabel value="high" control={<Radio />} label="High" />
            <FormControlLabel value="emergency" control={<Radio />} label="Emergency" />

          </RadioGroup>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel
              id="security-type-label"
              color="primary"
              htmlFor={"security-type-label"}
          >
            Threat Type
          </InputLabel>
          <Select
              labelId="security-type-label"
              id="security-type"
              label="security-type"
              value={threatType}
              onChange = {handleChangeThreatType}/* add funtion here */
              fullWidth
          >
            <MenuItem value="intruder">Intruder</MenuItem>
            <MenuItem value="terrorist">Terrorist</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </Select>
        </FormControl>
        <br/><br/>
        <FormControl fullWidth>
          <InputLabel
              id="location-label"
              color="primary"
              htmlFor={"location-label"}
          >
            Security Type
          </InputLabel>
          <Select
              labelId="location-label"
              id="serviceLocation"
              label="Location"
              value={securityType}
              onChange = {handleChangeSecurityType}/* add funtion here */
              fullWidth
          >
            <MenuItem value="bodyguard">Bodyguard</MenuItem>
            <MenuItem value="escort">Escort</MenuItem>
          </Select>
        </FormControl>

        <div className={styles.buttonGroup}>
          <button
              className={`${styles.button} ${styles.backButton}`}
              type="button"
              onClick={handleBack}
          >
            Back
          </button>
          <button
              className={`${styles.button} ${styles.reviewButton}`}
              type="button"
              onClick={submit}
          >
            Continue
          </button>
        </div>
      </form>
    </Paper>
    </div>
  );
};

export default SecurityRequest;
