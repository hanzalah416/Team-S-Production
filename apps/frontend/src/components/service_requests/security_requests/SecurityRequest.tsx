import React, { useState, useEffect } from "react";
import InputLabel from "@mui/material/InputLabel";
// import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
// import Select, { SelectChangeEvent } from "@mui/material/Select";
import Autocomplete from "@mui/material/Autocomplete";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import Paper from "@mui/material/Paper";
// import RadioGroup from "@mui/material/RadioGroup";
// import FormControlLabel from "@mui/material/FormControlLabel";
// import Radio from "@mui/material/Radio";
import styles from "./SecurityRequest.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import BackgroundImg2 from "../../assets/blue-background2.jpg";
import Tooltip from "../../ToolTip";

const tips = `
Name of Requester: Type in the full name of the individual requesting the room reservation.

Room: Select the room you wish to schedule from the dropdown menu. The dropdown should list available rooms or spaces.

Priority: If required, choose the priority of your booking (e.g., high, medium, low). This may influence how the room scheduling is handled if there are conflicting requests.

Status: This dropdown might be used to select the current status of the request, such as 'pending,' 'confirmed,' or 'cancelled.' If you’re just filling out the form for the first time, there may be a default setting or you may need to select 'pending.'

Start Date: Click on the field to open a calendar view and select the date when you need the room. Ensure you enter the correct format if typing directly (mm/dd/yyyy).

End Date: Similarly, select or enter the date when the reservation will end

`;
//Interface for positions
interface Position {
  label: string;
  id: string;
  top: string;
  left: string;
}

//Interface for nodes
interface Node {
  xcoord: string;
  ycoord: string;
  id: string;
  longName: string;
}

// Interface for Staff
interface Staff {
  employeeName: string;
}

export default function SecurityRequest() {
  const [staffName, setStaffName] = useState<Staff | null>(null);
  const [priority, setPriority] = useState("");
  const [location, setLocation] = useState<Position | null>(null);
  const [status, setStatus] = useState("");
  const [locations, setLocations] = useState<Position[]>([]);
  const [staffNames, setStaffNames] = useState<Staff[]>([]);
  const [threatType, setThreatType] = useState("");
  const [securityType, setSecurityType] = useState("");
  const navigate = useNavigate();

  const toggleScrolling = (disableScroll: boolean) => {
    if (disableScroll) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  };

  const handleChangeName = (value: Staff | null) => {
    setStaffName(value);
  };

  const handlePriorityChange = (event: SelectChangeEvent) => {
    setPriority(event.target.value as string);
  };
  const handleStatusChange = (event: SelectChangeEvent) => {
    setStatus(event.target.value as string);
  };

  const handleChangeLocation = (value: Position | null) => {
    setLocation(value);
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

  useEffect(() => {
    // Fetch staff data from backend
    fetch("/api/all-staff")
      .then((response) => response.json())
      .then((staffInfo: Staff[]) => {
        const formattedStaff: Staff[] = staffInfo.map((staff) => ({
          employeeName: staff.employeeName || "unknown",
        }));
        setStaffNames(formattedStaff);
      })
      .catch((error) => console.error("Failed to fetch staff data:", error));
  }, []);

  function clear() {
    setStaffName(null);
    setPriority("");
    setLocation(null);
    setStatus("");
    setThreatType("");
    setSecurityType("");
  }

  async function submit() {
    const securityRequestSent = {
      name: staffName?.employeeName,
      priority: priority,
      location: location?.label,
      status: status,
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
        console.log("Schedule request sent successfully");
        navigate("/order-flowers-result");
      })
      .catch(() => {
        console.log("Room Scheduling failed");
        console.log(securityRequestSent);
        alert("Scheduling failed to send. Please try again later");
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
            Room Scheduling Request Form
            <Tooltip
              style={{ position: "absolute", right: "20px", top: 0 }}
              tips={tips}
            />
          </p>
          <p className={"names"}>Jeffrey Li and Nate Schneider</p>

          <Stack alignItems="center" justifyContent="center" spacing={3} p={4}>
            <div className={"breakline"}></div>
            <br />
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
                    fontStyle: "italic",
                  }}
                  id="demo-simple-select-label"
                >
                  Name of Requester
                </InputLabel>
                <Autocomplete
                  sx={{ minWidth: 250, color: "#3B54A0" }}
                  options={staffNames}
                  getOptionLabel={(option) => option.employeeName || "Unknown"}
                  //isOptionEqualToValue={(option, value) => option.id === value.id}
                  value={staffName}
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
                  onChange={(event, value) => handleChangeName(value)}
                />
              </div>

              <div>
                <InputLabel
                  style={{
                    color: "#3B54A0",
                    fontStyle: "italic",
                  }}
                  id="location-dropdown"
                >
                  Room
                </InputLabel>
                <Autocomplete
                  sx={{ minWidth: 250, color: "#3B54A0" }}
                  options={locations}
                  getOptionLabel={(option) => option.label || "Unknown"}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
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
            </Stack>

            <div>
              <InputLabel
                style={{
                  color: "#3B54A0",
                  fontStyle: "italic",
                }}
                id="priority-dropdown"
              >
                Priority
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={priority}
                label=""
                onChange={handlePriorityChange}
                sx={{ minWidth: 518, color: "#3B54A0" }}
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
                  fontStyle: "italic",
                }}
                id="demo-simple-select-label"
              >
                Status
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={status}
                label=""
                onChange={handleStatusChange}
                sx={{ minWidth: 518 }}
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
              <div>
                <InputLabel
                  style={{
                    color: "#3B54A0",
                    fontStyle: "italic",
                  }}
                  id="demo-simple-select-label"
                >
                  Start Date
                </InputLabel>
                <TextField
                  value={threatType}
                  id="date"
                  sx={{ minWidth: 20 }}
                  type="datetime-local"
                  className={styles.textBox}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setThreatType(e.target.value);
                  }}
                />
              </div>
              <div>
                <InputLabel
                  style={{
                    color: "#3B54A0",
                    fontStyle: "italic",
                  }}
                  id="demo-simple-select-label"
                >
                  End Date
                </InputLabel>
                <TextField
                  value={securityType}
                  sx={{ minWidth: 20 }}
                  id="date"
                  type="datetime-local"
                  className={styles.textBox}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setSecurityType(e.target.value);
                  }}
                />
              </div>
            </Stack>

            <br />
            <Stack
              spacing={3}
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
                sx={{ minWidth: 150, fontFamily: "Jaldi", fontSize: 20 }}
                onClick={clear}
              >
                Clear
              </Button>

              <Button
                style={{
                  backgroundColor: "#3B54A0",
                }}
                variant="contained"
                sx={{ minWidth: 150, fontFamily: "Jaldi", fontSize: 20 }}
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
      </Grid>
    </div>
  );
}
