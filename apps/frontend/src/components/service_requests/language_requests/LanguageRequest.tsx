import React, { useEffect, useState } from "react";
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

const LanguageRequest: React.FC = () => {
  const [staffName, setStaffName] = useState("");
  const [requestPriority, setRequestPriority] = useState("");
  const [requestStatus, setRequestStatus] = useState("");
  const [language, setLanguage] = useState("");
  const [location, setLocation] = useState<Position | null>(null);

  const navigate = useNavigate(); //Function to navigate to other pages
  const [locations, setLocations] = useState<Position[]>([]);

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
      staffName == "" ||
      location == null ||
      requestPriority == "" ||
      requestStatus == "" ||
      language == ""
    ) {
      alert("Please fill out all of the fields");
      return;
    }
    const languageRequestSent = {
      name: staffName,
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
    setStaffName("");
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
        <p className={"title"}>Language Request Form</p>
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
              sx={{ minWidth: 400 }}
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
              Language
            </InputLabel>
            <Select
              sx={{ minWidth: 400 }}
              labelId="location-label"
              id="serviceLocation"
              value={language}
              onChange={handleChangeLanguage} /* add funtion here */
            >
              <MenuItem value="spanish">Spanish</MenuItem>
              <MenuItem value="mandarin">Mandarin</MenuItem>
              <MenuItem value="german">German</MenuItem>
              <MenuItem value="french">French</MenuItem>
              <MenuItem value="arabic">Arabic</MenuItem>
              <MenuItem value="hindi">Hindi</MenuItem>
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
};

export default LanguageRequest;
