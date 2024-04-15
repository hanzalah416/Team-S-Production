import React, { useEffect, useState } from "react";
import { securityform } from "../../common/securityform.ts";
import {
  InputLabel,
  Select,
  TextField,
  Paper,
  SelectChangeEvent,
  Button,
  Grid,
  Stack,
  Autocomplete,
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
import { useNavigate } from "react-router-dom";


interface Node {
  xcoord: string;
  ycoord: string;
  id: string;
  longName: string;
  // Add other properties if needed
}

interface Position {
  label: string;
  id: string;
  top: string;
  left: string;
}

const SecurityRequest: React.FC = () => {
  const [staffName, setStaffName] = useState("");
  const [requestPriority, setRequestPriority] = useState("");
  const [requestStatus, setRequestStatus] = useState("");
  const [securityType, setSecurityType] = useState("");
  const [threatType, setThreatType] = useState("");
  const [location, setLocation] = useState<Position | null>(null);

  const navigate = useNavigate(); //Function to navigate to other pages
  const [locations, setLocations] = useState<Position[]>([]);
  const [submittedRequests, setSubmittedRequests] = useState<securityform[]>(
    [],
  );


  const handleChangeSecurityType = (event: SelectChangeEvent) => {
    setSecurityType(event.target.value as string);
  };

  const handleChangeThreatType = (event: SelectChangeEvent) => {
    setThreatType(event.target.value as string);
  };

  const handleChangeRequestStatus = (event: SelectChangeEvent) => {
    setRequestStatus(event.target.value as string);
  };

  const handleChangeLocation = (value: Position | null) => {
    setLocation(value);
  };

  const handleChangeRequestPriority = (event: SelectChangeEvent) => {
    setRequestPriority(event.target.value as string);
  };

  async function submit() {
    if (staffName == ""
      || location == null
      || requestPriority == ""
      || requestStatus == ""
      || threatType == ""
      || securityType == "") {
      alert("Please fill out all of the fields");
      return;
    }
    const securityRequestSent: securityform = {
      name: staffName,
      location: location.label,
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
        navigate("/order-flowers-result");
      })
      .catch(() => {
        console.log("Order failed to send");
        console.log(securityRequestSent);
        alert("Order failed to send. Please try again later");
      });

    setSubmittedRequests([...submittedRequests, securityRequestSent]);
  }

  function clear() {
    setStaffName("");
    setRequestPriority("");
    setLocation(null);
    setSecurityType("");
    setThreatType("");
    setRequestStatus("");
  }

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

          setLocations(formattedLocations);
        })
        .catch((error) => console.error("Failed to fetch node data:", error));
  }, []);

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
                id="demo-simple-select-label"
            >
              Name of Requester
            </InputLabel>
            <TextField
                style={{
                  borderColor: "#3B54A0",
                  color: "#3B54A0",
                  accentColor: "#3B54A0",
                  borderBlockColor: "#3B54A0",
                }}
                id="outlined-controlled"
                label=""
                value={staffName}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setStaffName(event.target.value);
                }}
                sx={{minWidth: 400}}
            />
          </div>
          <div>
            <InputLabel
                style={{
                  color: "#3B54A0",
                }}
                id="priority-dropdown"
            >
              Priority
            </InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={requestPriority}
                label=""
                onChange={(e) => {
                  handleChangeRequestPriority(e);
                }}
                sx={{minWidth: 400, color: "#3B54A0"}}
            >
              <MenuItem value={"Low"}>Low</MenuItem>
              <MenuItem value={"Medium"}>Medium</MenuItem>
              <MenuItem value={"High"}>High</MenuItem>
              <MenuItem value={"Emergency"}>Emergency</MenuItem>
            </Select>
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
                sx={{minWidth: 400, color: "#3B54A0"}}
                options={locations}
                getOptionLabel={(option) => option.label || "Unknown"}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={location}
                renderInput={(params) => (
                    <TextField
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
                onChange={(event, value) => handleChangeLocation(value)}
            />
          </div>




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
                  sx={{minWidth: 400}}
                  labelId="threat-type-label"
                  id="threat-type"
                  value={threatType}
                  onChange={handleChangeThreatType} /* add funtion here */
              >
                <MenuItem value="trespassing">Trespassing</MenuItem>
                <MenuItem value="terrorism">Terrorism</MenuItem>
                <MenuItem value="vandalism">Vandalism</MenuItem>
                <MenuItem value="theft">Theft</MenuItem>
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
                  sx={{minWidth: 400}}
                  labelId="location-label"
                  id="serviceLocation"
                  value={securityType}
                  onChange={handleChangeSecurityType} /* add funtion here */
              >
                <MenuItem value="bodyguard">Bodyguard</MenuItem>
                <MenuItem value="escort">Escort</MenuItem>
                <MenuItem value="crowd_control">Crowd Control</MenuItem>
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
              Status
            </InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={requestStatus}
                label=""
                onChange={(e) => {
                  handleChangeRequestStatus(e);
                }}
                sx={{minWidth: 400}}
            >
              <MenuItem value={"unassigned"}>Unassigned</MenuItem>
              <MenuItem value={"assigned"}>Assigned</MenuItem>
              <MenuItem value={"in_progress"}>In Progress</MenuItem>
              <MenuItem value={"closed"}>Closed</MenuItem>
            </Select>
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
                sx={{minWidth: 100}}
                onClick={clear}
            >
              Clear
            </Button>

            <Button
                style={{
                  backgroundColor: "#3B54A0",
                }}
                variant="contained"
                sx={{minWidth: 100}}
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

export default SecurityRequest;
