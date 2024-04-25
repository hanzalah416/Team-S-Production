import React, { useEffect, useState } from "react";
import BackgroundImg2 from "../../assets/blue-background2.jpg";
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
import Tooltip from "../../ToolTip";

const tips = `
Name of Requester: Enter the full name of the person requiring language assistance.

Priority: Click on the dropdown menu to indicate the urgency of the request. The options may include urgent, high, medium, or low.

Location: Use the dropdown to select the location where the language services are needed. This might refer to a specific department, office, or event location.

Language: Choose the language for which assistance is required from the dropdown menu. This might list languages such as Spanish, French, Mandarin, etc.

Status: If the form allows for setting a status, select the current status of the request, like 'new', 'pending', 'approved', or 'completed'.

`;
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

// Interface for Staff
interface Staff {
  employeeName: string;
}

const LanguageRequest: React.FC = () => {
  const [staffName, setStaffName] = useState<Staff | null>(null);
  const [requestPriority, setRequestPriority] = useState("");
  const [requestStatus, setRequestStatus] = useState("");
  const [language, setLanguage] = useState("");
  const [location, setLocation] = useState<Position | null>(null);

  const navigate = useNavigate(); //Function to navigate to other pages
  const [locations, setLocations] = useState<Position[]>([]);
  const [staffNames, setStaffNames] = useState<Staff[]>([]);

  const handleChangeName = (value: Staff | null) => {
    setStaffName(value);
  };

  const handleChangeLanguage = (event: SelectChangeEvent) => {
    setLanguage(event.target.value as string);
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
    if (
      staffName == null ||
      location == null ||
      requestPriority == "" ||
      requestStatus == "" ||
      language == ""
    ) {
      alert("Please fill out all of the fields");
      return;
    }
    const languageRequestSent = {
      name: staffName.employeeName,
      location: location.label,
      status: requestStatus,
      priority: requestPriority,
      language: language,
    };

    await axios
      .post("/api/language-request", languageRequestSent, {
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
        console.log(languageRequestSent);
        alert("Order failed to send. Please try again later");
      });
  }

  function clear() {
    setStaffName(null);
    setRequestPriority("");
    setLocation(null);
    setLanguage("");
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
            Language Request Form
            <Tooltip
              style={{ position: "absolute", right: "40px", top: 0 }}
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
              <div>
                <InputLabel
                  style={{
                    color: "#3B54A0",
                    fontStyle: "italic",
                  }}
                  id="staffName-dropdown"
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
                  sx={{ minWidth: 250, color: "#3B54A0" }}
                >
                  <MenuItem value={"Low"}>Low</MenuItem>
                  <MenuItem value={"Medium"}>Medium</MenuItem>
                  <MenuItem value={"High"}>High</MenuItem>
                  <MenuItem value={"Emergency"}>Emergency</MenuItem>
                </Select>
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
                    fontStyle: "italic",
                  }}
                  id="location-dropdown"
                >
                  Location
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

              <div>
                <InputLabel
                  style={{
                    color: "#3B54A0",
                    fontStyle: "italic",
                  }}
                  id="demo-simple-select-label"
                >
                  Language
                </InputLabel>
                <Select
                  sx={{ minWidth: 250 }}
                  labelId="location-label"
                  id="serviceLocation"
                  value={language}
                  onChange={handleChangeLanguage} /* add funtion here */
                >
                  <MenuItem value="Spanish">Spanish</MenuItem>
                  <MenuItem value="Mandarin">Mandarin</MenuItem>
                  <MenuItem value="German">German</MenuItem>
                  <MenuItem value="French">French</MenuItem>
                  <MenuItem value="Arabic">Arabic</MenuItem>
                  <MenuItem value="Hindi">Hindi</MenuItem>
                </Select>
              </div>
            </Stack>
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
                value={requestStatus}
                label=""
                onChange={(e) => {
                  handleChangeRequestStatus(e);
                }}
                sx={{ minWidth: 518 }}
              >
                <MenuItem value={"unassigned"}>Unassigned</MenuItem>
                <MenuItem value={"assigned"}>Assigned</MenuItem>
                <MenuItem value={"in_progress"}>In Progress</MenuItem>
                <MenuItem value={"closed"}>Closed</MenuItem>
              </Select>
            </div>
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
      </Grid>
    </div>
  );
};

export default LanguageRequest;
