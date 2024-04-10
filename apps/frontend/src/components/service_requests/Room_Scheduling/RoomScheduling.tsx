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
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import styles from "./RoomScheduling.module.css";

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

export default function RoomScheduling() {
  const [name, setName] = useState("");
  const [priority, setPriority] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("");
  const [locations, setLocations] = useState<Position[]>([]);
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
  const [submittedEntries, setSubmittedEntries] = useState([]);

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

  // const handlePriorityChange = (event: SelectChangeEvent) => {
  //   setPriority(event.target.value as string);
  // };
  // const handleStatusChange = (event: SelectChangeEvent) => {
  //   setStatus(event.target.value as string);
  // };

  function submit() {
    const newEntry = {
      name: name,
      priority: priority,
      location: location,
      status: status,
        startTime: startTime,
        endTime: endTime
    };
    setSubmittedEntries((prevEntries) => [...prevEntries, newEntry]);
    clear();
  }

  function clear() {
    setName("");
    setPriority("");
    setLocation("");
    setStatus("");
    setStartTime("");
      setEndTime("");
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
        <p className={"title"}>Room Scheduling Form </p>
        <p className={"names"}>Jeffrey Li and Nate Schneider</p>

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
                      value={name}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                          setName(event.target.value);
                      }}
                      sx={{minWidth: 400}}
                  />
              </div>

              <div>
                  <InputLabel
                      style={{
                          color: "#3B54A0",
                      }}
                      id="location-dropdown"
                  >
                      Room
                  </InputLabel>
                  <Autocomplete
                      options={locations}
                      getOptionLabel={(option) => option.label || "Unknown"}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      renderInput={(params) => (
                          <TextField
                              sx={{minWidth: 400}}
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
                      onChange={(event, value) => setLocation(value.label)}
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
                      value={priority}
                      onChange={(e) => {
                          setPriority(e.target.value);
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
                      value={status}
                      onChange={(e) => {
                          setStatus(e.target.value);
                      }}
                  >
                      <FormControlLabel
                          style={{
                              color: "#3D4A6B",
                              font: "Jaldi",
                          }}
                          value="Unassigned"
                          control={<Radio />}
                          label="Unassigned"
                      />
                      <FormControlLabel
                          style={{
                              color: "#3D4A6B",
                              font: "Jaldi",
                          }}
                          value="Assigned"
                          control={<Radio />}
                          label="Assigned"
                      />
                      <FormControlLabel
                          style={{
                              color: "#3D4A6B",
                              font: "Jaldi",
                          }}
                          value="In Progress"
                          control={<Radio />}
                          label="In Progress"
                      />
                      <FormControlLabel
                          style={{
                              color: "#3D4A6B",
                              font: "Jaldi",
                          }}
                          value="Closed"
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
                          Start Date
                      </InputLabel>
                      <TextField
                          value={startTime}
                          id="date"
                          sx={{Width: 20}}
                          type="datetime-local"
                          className="border border-slate-300 rounded p-2 w-full"
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              setStartTime(e.target.value);
                          }}
                      />
                  </div>
                  <div>
                      <InputLabel
                          style={{
                              color: "#3B54A0",
                          }}
                          id="demo-simple-select-label"
                      >
                          End Date
                      </InputLabel>
                      <TextField
                          value={endTime}
                          sx={{minWidth: 20}}
                          id="date"
                          type="datetime-local"
                          className={styles.textBox}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              setEndTime(e.target.value);
                          }}
                      />
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
        <br/>
        <br/>
        <br/>
        <Paper elevation={4}>
            <TableContainer component={Paper}>
                <Table sx={{minWidth: 700}}>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell className={"border border-gray-800 p-2"}>
                                Name
                            </StyledTableCell>
                            <StyledTableCell className={"border border-gray-800 p-2"}>
                                Priority
                            </StyledTableCell>
                            <StyledTableCell className={"border border-gray-800 p-2"}>
                                Room
                            </StyledTableCell>
                            <StyledTableCell className={"border border-gray-800 p-2"}>
                                Start Time
                            </StyledTableCell>
                            <StyledTableCell className={"border border-gray-800 p-2"}>
                                End Time
                            </StyledTableCell>
                            <StyledTableCell className={"border border-gray-800 p-2"}>
                                Status
                            </StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {submittedEntries.map((entry, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell
                    component="th"
                    scope="row"
                    className={"border border-gray-800 p-2"}
                  >
                    {entry.name}
                  </StyledTableCell>
                  <StyledTableCell className={"border border-gray-800 p-2"}>
                    {entry.priority}
                  </StyledTableCell>
                  <StyledTableCell className={"border border-gray-800 p-2"}>
                    {entry.location}
                  </StyledTableCell>
                  <StyledTableCell className={"border border-gray-800 p-2"}>
                    {entry.startTime}
                  </StyledTableCell>
                  <StyledTableCell className={"border border-gray-800 p-2"}>
                    {entry.endTime}
                  </StyledTableCell>
                  <StyledTableCell className={"border border-gray-800 p-2"}>
                    {entry.status}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Grid>
  );
}
