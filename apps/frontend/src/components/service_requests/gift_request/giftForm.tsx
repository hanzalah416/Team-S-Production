import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Autocomplete from "@mui/material/Autocomplete";
import "./giftForm.css";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
// import Radio from "@mui/material/Radio";
// import RadioGroup from "@mui/material/RadioGroup";
// import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import Paper from "@mui/material/Paper";
import axios from "axios";
// import BackgroundImg from "./blue-background.jpg";
import BackgroundImg2 from "../../assets/blue-background2.jpg";
import styles from "../../login/Login.module.css";
import teddybear from "../../assets/GiftPhotos/teddybeargift.png";
import coloringbook from "../../assets/GiftPhotos/coloringbook.webp";
import fruit from "../../assets/GiftPhotos/fruitgift.png";

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
export default function GiftForm() {
  const [staffName, setStaffName] = useState<Staff | null>(null);
  const [priority, setPriority] = useState("");
  const [location, setLocation] = useState<Position | null>(null);
  const [typeGift, setTypeGift] = useState("");
  const [customMessage, setCustomMessage] = useState("");
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
      typeGift: typeGift,
      customMessage: customMessage,
      status: status,
    };
    // const token = await getAccessTokenSilently();
    await axios
      .post("/api/gift-request", newEntry, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(() => {
        console.log("Gift request sent successfully");
        navigate("/payment-info");
      })
      .catch(() => {
        console.log("Gift request failed to send");
        console.log(newEntry);
        alert("Gift request failed to send. Please try again later.");
      });
    clear();
  }

  function clear() {
    setStaffName(null);
    setPriority("");
    setLocation(null);
    setTypeGift("");
    setCustomMessage("");
    setStatus("");
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

        <Paper elevation={4}>
          <br />
          <p className={"title"}>Gift Request Form </p>
          <p className={"names"}>Dorothy Alexander</p>

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
                sx={{ minWidth: 518, color: "#3B54A0" }}
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
                Gift Type
              </InputLabel>
              <div style={{ display: "flex" }}>
                <img
                  src={coloringbook}
                  alt="Covering 3/4 page"
                  className={styles.poppies}
                  style={{ width: "200px", height: "auto" }}
                />

                <img
                  src={fruit}
                  alt="Covering 3/4 page"
                  className={styles.roses}
                  style={{ width: "200px", height: "auto" }}
                />
                <img
                  src={teddybear}
                  alt="Covering 3/4 page"
                  className={styles.tulips}
                  style={{ width: "200px", height: "auto" }}
                />
              </div>
              <ToggleButtonGroup
                color="primary"
                value={typeGift} // Use the state value here
                exclusive
                onChange={(
                  _event: React.MouseEvent<HTMLElement>,
                  newValue: string | null,
                ) => {
                  if (newValue !== null) {
                    setTypeGift(newValue); // Update state on change
                  }
                }}
                aria-label="Gift Type Buttons"
                sx={{ minWidth: 120 }}
              >
                <ToggleButton
                  style={{
                    color: "#10778c",
                    outlineColor: "#949DB5",
                    borderColor: "#949DB5",
                  }}
                  value="Coloring Book"
                >
                  Coloring Book
                </ToggleButton>
                <ToggleButton
                  style={{
                    color: "#10778c",
                    outlineColor: "#949DB5",
                    borderColor: "#949DB5",
                  }}
                  value="Chocolate Strawberries"
                >
                  Chocolate Strawberries
                </ToggleButton>
                <ToggleButton
                  style={{
                    color: "#10778c",
                    outlineColor: "#949DB5",
                    borderColor: "#949DB5",
                  }}
                  value="Teddy Bear"
                >
                  Teddy Bear
                </ToggleButton>
              </ToggleButtonGroup>
            </div>

            <div>
              <FormLabel
                style={{
                  color: "#3B54A0",
                  fontStyle: "italic",
                }}
                id="demo-controlled-radio-buttons-group"
              >
                Enter Custom Message
              </FormLabel>
              <form>
                <input
                  type="text"
                  style={{
                    width: "518px", // Set the width to make it larger
                    height: "60px", // Set the height to make it taller
                    backgroundColor: "white", // Set the background color to white
                    border: "1px solid #ccc", // Add a border for better visibility
                    borderRadius: "5px", // Optional: Add rounded corners for aesthetics
                    padding: "5px", // Optional: Add padding for better spacing
                  }}
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                />
              </form>
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
}
