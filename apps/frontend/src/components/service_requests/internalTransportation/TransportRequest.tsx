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
import { Position } from "../../common/PositionInterface.ts";
import { Node } from "../../common/NodeInterface.ts";
import Tooltip from "../../ToolTip";

const tips = `
Name of Requester: Enter the full name of the staff member requesting patient transportation.

Name of Patient: Enter the name the patient would like the transportation team to refer to them as. 

PickupLocation: Use the dropdown to select the location the patient is to be picked up from. This might refer to a specific department, office, or event location.

PickupLocation: Use the dropdown to select the location the patient is to be dropped off at. This might refer to a specific department, office, or event location.

Transportation Type: Select the type of transportation required from the drop down menu.

Priority: Click on the dropdown menu to indicate the urgency of the request. The options may include urgent, high, medium, or low.

Status: If the form allows for setting a status, select the current status of the request, like 'new', 'pending', 'approved', or 'completed'.

`;

interface Staff {
  employeeName: string;
}

const TransportRequest: React.FC = () => {
  const [staffName, setStaffName] = useState<Staff | null>(null);
  const [requestPriority, setRequestPriority] = useState("");
  const [requestStatus, setRequestStatus] = useState("");
  const [patientName, setPatientName] = useState("");
  const [transportationType, setTransportationType] = useState("");
  const [pickupLocation, setPickupLocation] = useState<Position | null>(null);
  const [dropOffLocation, setDropOffLocation] = useState<Position | null>(null);

  const navigate = useNavigate(); //Function to navigate to other pages
  const [locations, setLocations] = useState<Position[]>([]);
  const [staffNames, setStaffNames] = useState<Staff[]>([]);
  // const handleChangeLanguage = (event: SelectChangeEvent) => {
  //   setPatientName(event.target.value as string);
  // };

  const handleChangeRequestStatus = (event: SelectChangeEvent) => {
    setRequestStatus(event.target.value as string);
  };

  const handleChangeName = (value: Staff | null) => {
    setStaffName(value);
  };

  const handleChangeTransportationType = (event: SelectChangeEvent) => {
    setTransportationType(event.target.value as string);
  };

  const handleChangePickupLocation = (value: Position | null) => {
    setPickupLocation(value);
  };

  const handleChangeDropOffLocation = (value: Position | null) => {
    setDropOffLocation(value);
  };

  const handleChangeRequestPriority = (event: SelectChangeEvent) => {
    setRequestPriority(event.target.value as string);
  };

  async function submit() {
    if (
      staffName == null ||
      pickupLocation == null ||
      requestPriority == "" ||
      requestStatus == "" ||
      dropOffLocation == null ||
      patientName == ""
    ) {
      alert("Please fill out all of the fields");
      return;
    }
    const TransportRequestSent = {
      name: staffName.employeeName,
      priority: requestPriority,
      patientName: patientName,
      transportationType: transportationType,
      startLocation: pickupLocation.label,
      endLocation: dropOffLocation.label,
      status: requestStatus,
    };

    await axios
      .post("/api/transport-request", TransportRequestSent, {
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
        console.log(TransportRequestSent);
        alert("Order failed to send. Please try again later");
      });
  }

  function clear() {
    setStaffName(null);
    setRequestPriority("");
    setTransportationType("");
    setPickupLocation(null);
    setDropOffLocation(null);
    setPatientName("");
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
          floor: node.floor,
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
            Transportation Request Form
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
                  id="set  patient name"
                >
                  Name of Patient
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
                  value={patientName}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setPatientName(event.target.value);
                  }}
                  sx={{ minWidth: 250 }}
                />
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
                  Pickup Location
                </InputLabel>
                <Autocomplete
                  sx={{ minWidth: 250, color: "#3B54A0" }}
                  options={locations}
                  getOptionLabel={(option) => option.label || "Unknown"}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  value={pickupLocation}
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
                  onChange={(event, value) => handleChangePickupLocation(value)}
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
                  Drop off Location
                </InputLabel>
                <Autocomplete
                  sx={{ minWidth: 250, color: "#3B54A0" }}
                  options={locations}
                  getOptionLabel={(option) => option.label || "Unknown"}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  value={dropOffLocation}
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
                  onChange={(event, value) =>
                    handleChangeDropOffLocation(value)
                  }
                />
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
                  id="demo-simple-select-label"
                >
                  Transportation Type
                </InputLabel>
                <Select
                  sx={{ minWidth: 500 }}
                  labelId="location-label"
                  id="serviceLocation"
                  value={transportationType}
                  onChange={
                    handleChangeTransportationType
                  } /* add funtion here */
                >
                  <MenuItem value="wheelchair(Patient provided)">
                    Wheelchair(Patient provided)
                  </MenuItem>
                  <MenuItem value="wheelchair(requested)">
                    Wheelchair(requested)
                  </MenuItem>
                  <MenuItem value="Stretcher">Stretcher</MenuItem>
                  <MenuItem value="deceased">Deceased</MenuItem>
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
                  sx={{ minWidth: 250 }}
                >
                  <MenuItem value={"unassigned"}>Unassigned</MenuItem>
                  <MenuItem value={"assigned"}>Assigned</MenuItem>
                  <MenuItem value={"in_progress"}>In Progress</MenuItem>
                  <MenuItem value={"closed"}>Closed</MenuItem>
                </Select>
              </div>
              <br />
            </Stack>

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

export default TransportRequest;
