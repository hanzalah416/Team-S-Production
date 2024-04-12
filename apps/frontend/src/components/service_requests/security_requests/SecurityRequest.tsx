// OrderFlowers.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import styles from "./SecurityRequest.module.css";
//import { useFormData } from "./useFormData";
//import {Simulate} from "react-dom/test-utils";
//import submit = Simulate.submit;
import { securityform } from "../../common/securityform.ts";
import {
  InputLabel,
  Select,
  TextField,
  Paper,
  SelectChangeEvent,
  FormControlLabel,
  RadioGroup,
  Radio,
  Button,
  Table,
  TableBody,
  styled,
  TableRow,
  tableCellClasses,
  TableCell,
  TableHead,
  Grid,
  Stack,
  Autocomplete,
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import TableContainer from "@mui/material/TableContainer";
import axios from "axios";

interface Position {
  label: string;
  id: string;
  top: string;
  left: string;
}

interface Node {
  xcoord: string;
  ycoord: string;
  id: string;
  longName: string;
  // Add other properties if needed
}

const SecurityRequest: React.FC = () => {
  const [staffName, setStaffName] = useState("");
  const [location, setLocation] = useState("");
  const [requestPriority, setRequestPriority] = useState("");
  const [requestStatus, setRequestStatus] = useState("");
  const [securityType, setSecurityType] = useState("");
  const [threatType, setThreatType] = useState("");

  const [locations, setLocations] = useState<Position[]>([]);
  const [submittedRequests, setSubmittedRequests] = useState<securityform[]>(
    [],
  );

  const navigate = useNavigate();

  const handleChangeSecurityType = (event: SelectChangeEvent) => {
    setSecurityType(event.target.value as string);
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
      name: staffName,
      location: location,
      status: requestStatus,
      priority: requestPriority,
      threatType: threatType,
      securityType: securityType,
    };

    await axios
      .post("/api/security-request", securityRequestSent, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(() => {
        console.log("Order sent successfully");
        console.log(securityRequestSent);
      })
      .catch(() => {
        console.log("Order failed to send");
        console.log(securityRequestSent);
        alert("Order failed to send. Please try again later");
      });

    setSubmittedRequests([...submittedRequests, securityRequestSent]);
  }

  const handleBack = () => {
    navigate("/welcome");
  };

  const toggleScrolling = (disableScroll: boolean) => {
    if (disableScroll) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  };

  useEffect(() => {
    // Fetch node data from the backend
    fetch("/api/nodes")
      .then((response) => response.json())
      .then((nodes: Node[]) => {
        const formattedLocations: Position[] = nodes.map((node) => ({
          label: node.longName || "Unknown", // Use the correct property name
          id: node.id,
          top: `${node.ycoord}px`,
          left: `${node.xcoord}px`,
        }));

        console.log(formattedLocations);
        setLocations(formattedLocations);
      })
      .catch((error) => console.error("Failed to fetch node data:", error));
  }, []);

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
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

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
        <p className={"title"}>Security Request Form</p>
        <p className={"names"}>Ken Sebastian, Javier Moncada</p>
        <Stack alignItems="center" justifyContent="center" spacing={3} p={4}>
          <div>
            <InputLabel
              style={{
                color: "#3B54A0",
              }}
            >
              Staff Name
            </InputLabel>
            <TextField
              id="outlined-controlled"
              label=""
              value={staffName}
              style={{
                borderColor: "#3B54A0",
                color: "#3B54A0",
                accentColor: "#3B54A0",
                borderBlockColor: "#3B54A0",
              }}
              onChange={(e) => setStaffName(e.target.value)}
              sx={{ minWidth: 400 }}
            />
          </div>
          <div>
            <InputLabel
              style={{
                color: "#3B54A0",
              }}
              id="location-dropdown"
            >
              Location
            </InputLabel>
            <Autocomplete
              options={locations}
              getOptionLabel={(option) => option.label || "Unknown"}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => (
                <TextField
                  sx={{ minWidth: 400 }}
                  {...params}
                  label=""
                  InputLabelProps={{
                    style: {
                      fontFamily: "Poppins",
                      fontSize: 14,
                      textAlign: "center",
                    },
                  }}
                />
              )}
              onOpen={() => toggleScrolling(true)}
              onClose={() => toggleScrolling(false)}
              onChange={(event, value) => setLocation(value!.label)}
            />
          </div>

          <Stack
            spacing={10}
            direction="row"
            alignItems="center"
            justifyContent=""
          >
            <div>
              <InputLabel
                style={{
                  color: "#3B54A0",
                }}
                id="priority"
              >
                Priority
              </InputLabel>
              <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={requestPriority}
                onChange={(e) => {
                  handleChangeRequestPriority(e);
                }}
              >
                <FormControlLabel
                  style={{
                    color: "#3D4A6B",
                    font: "Jaldi",
                  }}
                  value="Emergency"
                  control={<Radio />}
                  label="Emergency"
                />
                <FormControlLabel
                  style={{
                    color: "#3D4A6B",
                    font: "Jaldi",
                  }}
                  value="High"
                  control={<Radio />}
                  label="High"
                />
                <FormControlLabel
                  style={{
                    color: "#3D4A6B",
                    font: "Jaldi",
                  }}
                  value="Medium"
                  control={<Radio />}
                  label="Medium"
                />
                <FormControlLabel
                  style={{
                    color: "#3D4A6B",
                    font: "Jaldi",
                  }}
                  value="Low"
                  control={<Radio />}
                  label="Low"
                />
              </RadioGroup>
            </div>

            <div>
              <InputLabel
                style={{
                  color: "#3B54A0",
                }}
                id="demo-simple-select-label"
              >
                Status
              </InputLabel>
              <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={requestStatus}
                onChange={(e) => {
                  handleChangeRequestStatus(e);
                }}
              >
                <FormControlLabel
                  style={{
                    color: "#3D4A6B",
                    font: "Jaldi",
                  }}
                  value="unassigned"
                  control={<Radio />}
                  label="Unassigned"
                />
                <FormControlLabel
                  style={{
                    color: "#3D4A6B",
                    font: "Jaldi",
                  }}
                  value="assigned"
                  control={<Radio />}
                  label="Assigned"
                />
                <FormControlLabel
                  style={{
                    color: "#3D4A6B",
                    font: "Jaldi",
                  }}
                  value="in_progress"
                  control={<Radio />}
                  label="In Progress"
                />
                <FormControlLabel
                  style={{
                    color: "#3D4A6B",
                    font: "Jaldi",
                  }}
                  value="closed"
                  control={<Radio />}
                  label="Closed"
                />
              </RadioGroup>
            </div>
          </Stack>

          <Stack
            spacing={2}
            direction="row"
            alignItems="center"
            justifyContent="center"
          >
            <div>
              <InputLabel
                style={{
                  color: "#3B54A0",
                }}
                id="demo-simple-select-label"
              >
                Threat Type
              </InputLabel>
              <Select
                sx={{ minWidth: 250 }}
                labelId="threat-type-label"
                id="threat-type"
                value={threatType}
                onChange={handleChangeThreatType} /* add funtion here */
              >
                <MenuItem value="intruder">Intruder</MenuItem>
                <MenuItem value="terrorist">Terrorist</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </div>
            <div>
              <InputLabel
                style={{
                  color: "#3B54A0",
                }}
                id="demo-simple-select-label"
              >
                Security Type
              </InputLabel>
              <Select
                sx={{ minWidth: 250 }}
                labelId="location-label"
                id="serviceLocation"
                value={securityType}
                onChange={handleChangeSecurityType} /* add funtion here */
              >
                <MenuItem value="bodyguard">Bodyguard</MenuItem>
                <MenuItem value="escort">Escort</MenuItem>
              </Select>
            </div>
          </Stack>

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

      <br />
      <br />
      <br />
      <Paper elevation={4}>
        <div className={"table"}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }}>
              <TableHead>
                <TableRow>
                  <StyledTableCell className={"border border-gray-800 p-2"}>
                    Staff Name
                  </StyledTableCell>
                  <StyledTableCell className={"border border-gray-800 p-2"}>
                    Location
                  </StyledTableCell>
                  <StyledTableCell className={"border border-gray-800 p-2"}>
                    Priority
                  </StyledTableCell>
                  <StyledTableCell className={"border border-gray-800 p-2"}>
                    Status
                  </StyledTableCell>
                  <StyledTableCell className={"border border-gray-800 p-2"}>
                    Threat Type
                  </StyledTableCell>
                  <StyledTableCell className={"border border-gray-800 p-2"}>
                    Security Type
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {submittedRequests.map((row, key) => (
                  <StyledTableRow key={key}>
                    <StyledTableCell className={"border border-gray-800 p-2"}>
                      {row.name}
                    </StyledTableCell>
                    <StyledTableCell className={"border border-gray-800 p-2"}>
                      {row.location}
                    </StyledTableCell>
                    <StyledTableCell className={"border border-gray-800 p-2"}>
                      {row.priority}
                    </StyledTableCell>
                    <StyledTableCell className={"border border-gray-800 p-2"}>
                      {row.status}
                    </StyledTableCell>
                    <StyledTableCell className={"border border-gray-800 p-2"}>
                      {row.threatType}
                    </StyledTableCell>
                    <StyledTableCell className={"border border-gray-800 p-2"}>
                      {row.securityType}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Paper>
    </Grid>
  );
};

export default SecurityRequest;
