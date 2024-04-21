import React, { useState, useEffect } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Autocomplete from "@mui/material/Autocomplete";
import "./MedicineDeliveryForm.css";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import Paper from "@mui/material/Paper";
import FreeSoloCreateOptionDialog from "./TextBoxMD.tsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BackgroundImg2 from "../../assets/blue-background2.jpg";

//Interface for positions
interface Position {
  label: string;
  id: string;
  top: string;
  left: string;
}

//Interace for nodes
interface Node {
  xcoord: string;
  ycoord: string;
  id: string;
  longName: string;
  // Add other properties if needed
}

export default function MedicineDeliveryForm() {
  const [name, setName] = useState("");
  const [priority, setPriority] = useState("");
  const [location, setLocation] = useState<Position | null>(null);
  const [nameMedicine, setNameMedicine] = useState("");
  const [typeMedicine, setTypeMedicine] = useState("");
  const [status, setStatus] = useState("");
  const [locations, setLocations] = useState<Position[]>([]);

  const navigate = useNavigate(); //Function to navigate to other pages

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

  const toggleScrolling = (disableScroll: boolean) => {
    if (disableScroll) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
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

  async function submit() {
    const newEntry = {
      name: name,
      priority: priority,
      location: location?.label,
      typeMedicine: typeMedicine,
      nameMedicine: nameMedicine,
      status: status,
    };

    await axios
      .post("/api/medicine-request", newEntry, {
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
    setName("");
    setPriority("");
    setLocation(null);
    setTypeMedicine("");
    setNameMedicine("");
    setStatus("");
  }

  return (
    <div style={{backgroundImage: `url(${BackgroundImg2})`, height: "100vh", width: "100vw",
          backgroundSize: "cover", backgroundRepeat: "no-repeat", minHeight: "100%",
          backgroundPosition: "center center", overflowX: "hidden"}}>
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

      <Paper
        elevation={4}
        sx={{ paddingLeft: 7, paddingRight: 7, paddingBottom: 4 }}
      >
        <br />
        <p className={"title"}>Medicine Delivery Request Form </p>
        <p className={"names"}>Kim Cummings & Riley Yu</p>
        <br />
          <Stack alignItems="center" justifyContent="center" spacing={3}>
              <div className={"breakline"}></div>
              <br/>
              <Stack
                  spacing={2}
                  direction="row"
                  alignItems="center"
                  justifyContent="center"
              >
                  <div>
                      <InputLabel
                          style={{
                              color: "#3B54A0", fontStyle: "italic"
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
                          value={name}
                          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                              setName(event.target.value);
                          }}
                          sx={{minWidth: 250}}
                      />
                  </div>
                  <div>
                      <InputLabel
                          style={{
                              color: "#3B54A0", fontStyle: "italic"
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
                          sx={{minWidth: 250, color: "#3B54A0"}}
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
                          color: "#3B54A0", fontStyle: "italic"
                      }}
                      id="location-dropdown"
                  >
                      Location
                  </InputLabel>
                  <Autocomplete
                      sx={{minWidth: 518, color: "#3B54A0"}}
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
                  <FormLabel
                      style={{
                          color: "#3B54A0", fontStyle: "italic"
                      }}
                      id="demo-controlled-radio-buttons-group"
                  >
                      Type of Medicine
                  </FormLabel>
                  <RadioGroup
                      aria-labelledby="demo-controlled-radio-buttons-group"
                      name="controlled-radio-buttons-group"
                      value={typeMedicine}
                      onChange={(e) => {
                          setTypeMedicine(e.target.value);
                      }}
                  >
                      <FormControlLabel
                          style={{
                              color: "#3D4A6B",
                              font: "Jaldi",
                          }}
                          value="Over the Counter"
                          control={<Radio/>}
                          label="Over the Counter"
                      />
                      <FormControlLabel
                          style={{
                              color: "#3D4A6B",
                              font: "Jaldi",
                          }}
                          value="Prescription"
                          control={<Radio/>}
                          label="Prescription"
                      />
                  </RadioGroup>
              </div>

              <div>
                  <FormLabel
                      style={{
                          color: "#3B54A0", fontStyle: "italic"
                      }}
                      id="demo-controlled-radio-buttons-group"
                  >
                      Medicine Name
                  </FormLabel>
                  {/*<form>*/}
                  {/*  <label htmlFor="medicineName">Medicine Name:</label>*/}
                  {/*  <input*/}
                  {/*    type="text"*/}
                  {/*    id="medicineName"*/}
                  {/*    name="medicineName"*/}
                  {/*    style={{*/}
                  {/*      width: "400px", // Set the width to make it larger*/}
                  {/*      height: "30px", // Set the height to make it taller*/}
                  {/*      backgroundColor: "white", // Set the background color to white*/}
                  {/*      border: "1px solid #ccc", // Add a border for better visibility*/}
                  {/*      borderRadius: "5px", // Optional: Add rounded corners for aesthetics*/}
                  {/*      padding: "5px", // Optional: Add padding for better spacing*/}
                  {/*    }}*/}
                  {/*    value={requestType}*/}
                  {/*    onChange={(e) => setRequestType(e.target.value)}*/}
                  {/*  />*/}
                  {/*</form>*/}
                  <FreeSoloCreateOptionDialog
                      nameMedicine={nameMedicine}
                      setNameMedicine={setNameMedicine}
                  />
              </div>

              <div>
                  <InputLabel
                      style={{
                          color: "#3B54A0", fontStyle: "italic"
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
                      sx={{minWidth: 518}}
                  >
                      <MenuItem value={"unassigned"}>Unassigned</MenuItem>
                      <MenuItem value={"assigned"}>Assigned</MenuItem>
                      <MenuItem value={"in_progress"}>In Progress</MenuItem>
                      <MenuItem value={"closed"}>Closed</MenuItem>
                  </Select>
              </div>
              <br/>

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
                      sx={{minWidth: 150, fontFamily: "Jaldi", fontSize: 20}}
                      onClick={clear}
                  >
                      Clear
                  </Button>

                  <Button
                      style={{
                          backgroundColor: "#3B54A0",
                      }}
                      variant="contained"
                      sx={{minWidth: 150, fontFamily: "Jaldi", fontSize: 20}}
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
