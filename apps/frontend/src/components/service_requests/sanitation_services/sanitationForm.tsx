import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Autocomplete from "@mui/material/Autocomplete";
import "./sanitationForm.css";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import Paper from "@mui/material/Paper";
import axios from "axios";
// import {useAuth0} from "@auth0/auth0-react";

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
export default function SanitationForm() {
  const [staffName, setStaffName] = useState<Staff | null>(null);
  const [priority, setPriority] = useState("");
  const [location, setLocation] = useState<Position | null>(null);
  const [sanitationType, setSanitationType] = useState("");
  const [permission, setPermission] = useState("");
  const [status, setStatus] = useState("");
  const [locations, setLocations] = useState<Position[]>([]);
  const [staffNames, setStaffNames] = useState<Staff[]>([]);
  const navigate = useNavigate(); //Function to navigate to other pages
  // const {getAccessTokenSilently} = useAuth0();

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

  const handleChangeLocation = (value: Position | null) => {
    setLocation(value);
  };
  const handlePriorityChange = (event: SelectChangeEvent) => {
    setPriority(event.target.value as string);
  };
  const handleStatusChange = (event: SelectChangeEvent) => {
    setStatus(event.target.value as string);
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

  async function submit() {
    const newEntry = {
      name: staffName?.employeeName,
      priority: priority,
      location: location?.label,
      sanitationType: sanitationType,
      permission: permission,
      status: status,
    };
    // const token = await getAccessTokenSilently();
    await axios
      .post("/api/sanitation-request", newEntry, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(() => {
        console.log("Sanitation request sent successfully");
        navigate("/order-flowers-result");
      })
      .catch(() => {
        console.log("Sanitation request  failed to send");
        console.log(newEntry);
        alert("Sanitation request failed to send. Please try again later");
      });
    clear();
  }

  function clear() {
    setStaffName(null);
    setPriority("");
    setLocation(null);
    setSanitationType("");
    setPermission("");
    setStatus("");
  }

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
        <p className={"title"}>Sanitation Request Form </p>
        <p className={"names"}>Jacob Antepli & Dorothy Alexander</p>

        <Stack alignItems="center" justifyContent="center" spacing={3} p={4}>
          <div>
            <InputLabel
              style={{
                color: "#3B54A0",
              }}
              id="staffName-dropdown"
            >
              Name of Requester
            </InputLabel>
            <Autocomplete
              sx={{ minWidth: 400, color: "#3B54A0" }}
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
              sx={{ minWidth: 400, color: "#3B54A0" }}
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
              sx={{ minWidth: 400, color: "#3B54A0" }}
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
              Request Type
            </InputLabel>
            <ToggleButtonGroup
              color="primary"
              value={sanitationType} // Use the state value here
              exclusive
              onChange={(
                _event: React.MouseEvent<HTMLElement>,
                newValue: string | null,
              ) => {
                if (newValue !== null) {
                  setSanitationType(newValue); // Update state on change
                }
              }}
              aria-label="Sanitation Type Buttons"
              sx={{ minWidth: 120 }}
            >
              <ToggleButton
                style={{
                  color: "#10778c",
                  outlineColor: "#949DB5",
                  borderColor: "#949DB5",
                }}
                value="Garbage Pickup"
              >
                Garbage Pickup
              </ToggleButton>
              <ToggleButton
                style={{
                  color: "#10778c",
                  outlineColor: "#949DB5",
                  borderColor: "#949DB5",
                }}
                value="Recycling Pickup"
              >
                Recycling Pickup
              </ToggleButton>
              <ToggleButton
                style={{
                  color: "#10778c",
                  outlineColor: "#949DB5",
                  borderColor: "#949DB5",
                }}
                value="Hazardous Waste Disposal"
              >
                Hazardous Waste Disposal
              </ToggleButton>
            </ToggleButtonGroup>
          </div>

          <div>
            <FormLabel
              style={{
                color: "#3B54A0",
              }}
              id="demo-controlled-radio-buttons-group"
            >
              Permission
            </FormLabel>
            <RadioGroup
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              value={permission}
              onChange={(e) => {
                setPermission(e.target.value);
              }}
            >
              <FormControlLabel
                style={{
                  color: "#3D4A6B",
                  font: "Jaldi",
                }}
                value="Only enter with supervision"
                control={<Radio />}
                label="Only enter with supervision"
              />
              <FormControlLabel
                style={{
                  color: "#3D4A6B",
                  font: "Jaldi",
                }}
                value="Can enter without supervision"
                control={<Radio />}
                label="Can enter without supervision"
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
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={status}
              label=""
              onChange={handleStatusChange}
              sx={{ minWidth: 400 }}
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
              sx={{ minWidth: 100 }}
              onClick={clear}
            >
              Clear
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
    </Grid>
  );
}
