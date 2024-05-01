import "../../AllMobile.css";
import { securityform } from "../../common/securityform.ts";
import React, { useEffect, useState } from "react";
import {
  InputLabel,
  Select,
  TextField,
  SelectChangeEvent,
  Button,
  Stack,
  Autocomplete,
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BackgroundImg2 from "../../assets/blue-background2.jpg";

interface Node {
  xcoord: string;
  ycoord: string;
  id: string;
  longName: string;
}

interface Position {
  label: string;
  id: string;
  top: string;
  left: string;
}

interface Staff {
  employeeName: string;
}

const MobileSecurity = () => {
  const [staffName, setStaffName] = useState<Staff | null>(null);
  const [requestPriority, setRequestPriority] = useState("");
  const [requestStatus, setRequestStatus] = useState("");
  const [securityType, setSecurityType] = useState("");
  const [threatType, setThreatType] = useState("");
  const [location, setLocation] = useState<Position | null>(null);

  const navigate = useNavigate(); //Function to navigate to other pages
  const [locations, setLocations] = useState<Position[]>([]);
  const [staffNames, setStaffNames] = useState<Staff[]>([]);
  const [submittedRequests, setSubmittedRequests] = useState<securityform[]>(
    [],
  );

  const handleChangeName = (value: Staff | null) => {
    setStaffName(value);
  };

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
    // Fetch staff data from the backend
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

  async function submit() {
    if (
      staffName == null ||
      location == null ||
      requestPriority == "" ||
      requestStatus == "" ||
      threatType == "" ||
      securityType == ""
    ) {
      alert("Please fill out all of the fields");
      return;
    }
    const securityRequestSent: securityform = {
      name: staffName.employeeName,
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
    setStaffName(null);
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
          Security Request Form
        </p>
        <p className={"names-mobile"}>Ken Sebastian, Javier Moncada</p>
        <div className={"breakline"}></div>
        <Stack alignItems="center" justifyContent="center" spacing={3} p={4}>
          <Stack
            spacing={2}
            direction="column"
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
                fontStyle: "italic",
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
              <MenuItem value="trespassing">Trespassing</MenuItem>
              <MenuItem value="terrorism">Terrorism</MenuItem>
              <MenuItem value="vandalism">Vandalism</MenuItem>
              <MenuItem value="theft">Theft</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </div>
          <Stack
            spacing={2}
            direction="column"
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
                <MenuItem value="crowd_control">Crowd Control</MenuItem>
                <MenuItem value="other">Other</MenuItem>
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
          </Stack>
          <br />

          <Stack
            spacing={3}
            direction="column"
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
      </div>
    </div>
  );
};

export default MobileSecurity;
