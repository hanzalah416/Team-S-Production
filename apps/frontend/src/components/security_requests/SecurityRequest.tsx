// OrderFlowers.tsx
import React, {useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SecurityRequest.module.css";
//import { useFormData } from "./useFormData";
//import {Simulate} from "react-dom/test-utils";
//import submit = Simulate.submit;
import { securityform } from "../common/securityform.ts";

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
  Radio,
  Button,
  Table,
  TableBody,
  styled,
  TableRow,
  tableCellClasses,
  TableCell,
  TableHead

} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import TableContainer from "@mui/material/TableContainer";

const SecurityRequest: React.FC = () => {
  const [staffName, setStaffName] = useState("");
  const [location, setLocation] = useState("");
  const [requestPriority, setRequestPriority] = useState("");
  const [requestStatus, setRequestStatus] = useState("");
  const [securityType, setSecurityType] = useState("");
  const [threatType, setThreatType] = useState("");

  const [submittedRequests, setSubmittedRequests] = useState<securityform[]>([]);

  const navigate = useNavigate();


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
    // if (staffName == "" ) {
    //   alert("Please Fill out the Patient Name and Room Number");
    //   return;
    // }

    const securityRequestSent: securityform = {
      staffName: staffName,
      location: location,
      requestStatus: requestStatus,
      requestPriority: requestPriority,
      threatType: threatType,
      securityType: securityType
    };

    setSubmittedRequests([...submittedRequests, securityRequestSent]);

  }

  useEffect(() => {
  }, [submittedRequests]);

  const handleBack = () => {
    navigate("/welcome");
  };

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));


  return (
    <div>
      <Paper>
        <br/><br/>
        <h2 className={styles.title}>Security Request</h2>
        <form>

          <FormControl
              sx={{m: 1, width: '25ch'}}
          >
            <TextField id="outlined-basic" label="Staff Name" variant="outlined"
                       onChange={(e) => setStaffName(e.target.value)}
            />
          </FormControl>

          <FormControl
              sx={{m: 1, width: '25ch'}}
          >
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
                onChange={handleChangeLocation}/* add funtion here */
                fullWidth
            >
              <MenuItem value="CCONF001L1">Anesthesia Conf Floor L1</MenuItem>
              <MenuItem value="CCONF003L1">Abrams Conference Room</MenuItem>
            </Select>
          </FormControl>
          <br/><br/>
          <FormControl>
            <FormLabel id="demo-controlled-radio-buttons-group">Request Status</FormLabel>
            <RadioGroup
                row
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={requestStatus}
                onChange={handleChangeRequestStatus}
            >
              <FormControlLabel value="unassigned" control={<Radio/>} label="Unassigned"/>
              <FormControlLabel value="assigned" control={<Radio/>} label="Assigned"/>
              <FormControlLabel value="in_progress" control={<Radio/>} label="In Progress"/>
              <FormControlLabel value="closed" control={<Radio/>} label="Closed"/>

            </RadioGroup>
          </FormControl>
          <br/><br/>
          <FormControl>
            <FormLabel id="demo-controlled-radio-buttons-group">Request Priority</FormLabel>
            <RadioGroup
                row
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="other"
                value={requestPriority}
                onChange={handleChangeRequestPriority}
            >
              <FormControlLabel value="low" control={<Radio/>} label="Low"/>
              <FormControlLabel value="medium" control={<Radio/>} label="Medium"/>
              <FormControlLabel value="high" control={<Radio/>} label="High"/>
              <FormControlLabel value="emergency" control={<Radio/>} label="Emergency"/>

            </RadioGroup>
          </FormControl>

          <br/><br/>

          <FormControl
              sx={{m: 1, width: '25ch'}}
          >
            <InputLabel
                id="security-type-label"
                color="primary"
                htmlFor={"security-type-label"}
            >
              Threat Type
            </InputLabel>
            <Select
                labelId="threat-type-label"
                id="threat-type"
                label="threat type "
                value={threatType }
                onChange={handleChangeThreatType}/* add funtion here */

            >
              <MenuItem value="intruder">Intruder</MenuItem>
              <MenuItem value="terrorist">Terrorist</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>
          <FormControl
              sx={{m: 1, width: '25ch'}}
          >
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
                label="security type "
                value={securityType}
                onChange={handleChangeSecurityType}/* add funtion here */
            >
              <MenuItem value="bodyguard">Bodyguard</MenuItem>
              <MenuItem value="escort">Escort</MenuItem>
            </Select>
          </FormControl>

          <br/><br/>
          <div>
            <Button
                variant="outlined"
                onClick={() => {
                  handleBack();
                }}>
              Back
            </Button>

            <Button
                variant="contained"
                onClick={() => {
                  submit();
                }}>
              Submit
            </Button>
          </div>

        </form>
        <br/><br/>



      </Paper>

      <div className={"table"}>
        <TableContainer component={Paper}>
          <Table sx={{minWidth: 700}} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Staff Name</StyledTableCell>
                <StyledTableCell>Location</StyledTableCell>
                <StyledTableCell>Status</StyledTableCell>
                <StyledTableCell>Priority</StyledTableCell>
                <StyledTableCell>Security Type</StyledTableCell>
                <StyledTableCell>Threat</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {submittedRequests.map((row, key) => (
                  <StyledTableRow key={key}>
                    <StyledTableCell>{row.staffName}</StyledTableCell>
                    <StyledTableCell>{row.location}</StyledTableCell>
                    <StyledTableCell>{row.requestStatus}</StyledTableCell>
                    <StyledTableCell>{row.requestPriority}</StyledTableCell>
                    <StyledTableCell>{row.securityType}</StyledTableCell>
                    <StyledTableCell>{row.threatType}</StyledTableCell>
                  </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

    </div>
  );
};

export default SecurityRequest;
