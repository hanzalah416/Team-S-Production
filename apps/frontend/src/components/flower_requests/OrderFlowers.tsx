// OrderFlowers.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Autocomplete from "@mui/material/Autocomplete";
import "./OrderFlowers.module.css";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import FormLabel from "@mui/material/FormLabel";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import Paper from "@mui/material/Paper";
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
  // Add other properties if needed
}

const OrderFlowers: React.FC = () => {
  const [nameRequester, setNameRequester] = useState("");
  const [priority, setPriority] = useState("");
  const [location, setLocation] = useState<Position | null>(null);
  const [typeFlower, setTypeFlower] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [status, setStatus] = useState("");

  const [locations, setLocations] = useState<Position[]>([]);

  const navigate = useNavigate();

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

  function clear() {
    setNameRequester("");
    setPriority("");
    setLocation(null);
    setTypeFlower("");
    setCustomMessage("");
    setStatus("");
  }

  async function submit() {
    if (
      nameRequester == "" ||
      priority == "" ||
      location == null ||
      typeFlower == "" ||
      customMessage == "" ||
      status == ""
    ) {
      alert("Please fill out all information on the page");
      return;
    }

    const orderFlowerSent = {
      name: nameRequester,
      priority: priority,
      location: location.label,
      typeFlower: typeFlower,
      customMessage: customMessage,
      status: status,
    };
    console.log(orderFlowerSent);

    await axios
      .post("/api/flower-request", orderFlowerSent, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(() => {
        console.log("Order sent successfully");
        navigate("/payment-info");
      })
      .catch(() => {
        console.log("Order failed to send");
        console.log(orderFlowerSent);
        alert("Order failed to send. Please try again later");
      });

    clear();
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
        <p className={"title"}>Flower Request Form </p>

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
              value={nameRequester}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setNameRequester(event.target.value);
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
              value={priority}
              label=""
              onChange={handlePriorityChange}
              sx={{ minWidth: 400, color: "#3B54A0" }}
            >
              <MenuItem value={"low"}>Low</MenuItem>
              <MenuItem value={"medium"}>Medium</MenuItem>
              <MenuItem value={"high"}>High</MenuItem>
              <MenuItem value={"emergency"}>Emergency</MenuItem>
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
              value={typeFlower} // Use the state value here
              exclusive
              onChange={(
                _event: React.MouseEvent<HTMLElement>,
                newValue: string | null,
              ) => {
                if (newValue !== null) {
                  setTypeFlower(newValue); // Update state on change
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
                value="Poppies"
              >
                Poppies
              </ToggleButton>
              <ToggleButton
                style={{
                  color: "#10778c",
                  outlineColor: "#949DB5",
                  borderColor: "#949DB5",
                }}
                value="Roses"
              >
                Roses
              </ToggleButton>
              <ToggleButton
                style={{
                  color: "#10778c",
                  outlineColor: "#949DB5",
                  borderColor: "#949DB5",
                }}
                value="Tulips"
              >
                Tulips
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
              Enter Custom Message
            </FormLabel>
            <form>
              <input
                type="text"
                style={{
                  width: "400px", // Set the width to make it larger
                  height: "30px", // Set the height to make it taller
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
};

export default OrderFlowers;

//   const navigate = useNavigate();
//   //const { formData, setFormData } = useFormData();
//
//   /*const handleReviewOrder = () => {
//       setFormData({
//         ...formData,
//         orderFlowers: {
//           patientName,
//           patientRoom,
//           customMessage,
//         },
//       });
//       navigate("/order-flowers-result");
//     };*/
//
//   async function submit() {
//     if (patientName == "" || patientRoom == "") {
//       alert("Please Fill out the Patient Name and Room Number");
//       return;
//     }
//
//     const orderFlowerSent: {
//       patientName: string;
//       customMessage: string;
//       PatientRoom: number;
//     } = {
//       patientName: patientName,
//       PatientRoom: parseInt(patientRoom),
//       customMessage: customMessage,
//     };
//     console.log(orderFlowerSent);
//
//     await axios
//       .post("/api/flower-request", orderFlowerSent, {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })
//       .then(() => {
//         console.log("Order sent successfully");
//         navigate("/order-flowers-result");
//       })
//       .catch(() => {
//         console.log("Order failed to send");
//         alert("Order failed to send. Please try again later.");
//       });
//   }
//
//   const handleBack = () => {
//     navigate("/welcome");
//   };
//
//   return (
//     <div className={styles.container}>
//       <h2 className={styles.title}>Order Flowers</h2>
//       <form>
//         <div className={styles.inputRow}>
//           <div className={styles.formGroup}>
//             <label className={styles.label}>Patient Name</label>
//             <input
//               className={styles.input}
//               type="text"
//               value={patientName}
//               onChange={(e) => setPatientName(e.target.value)}
//               placeholder="Add Name Here"
//             />
//           </div>
//           <div className={styles.formGroup}>
//             <label className={styles.label}>Patient Room</label>
//             <input
//               className={styles.input}
//               type="number"
//               value={patientRoom}
//               onKeyDown={(e) =>
//                 (e.keyCode === 69 || e.keyCode === 190) && e.preventDefault()
//               }
//               onChange={(e) => setPatientRoom(e.target.value)}
//               placeholder="Room Number Here"
//             />
//           </div>
//         </div>
//         <div className={styles.formGroup}>
//           <label className={styles.label}>Custom Message (optional)</label>
//           <textarea
//             className={`${styles.input} ${styles.largeTextarea}`}
//             value={customMessage}
//             onChange={(e) => setCustomMessage(e.target.value)}
//             placeholder="Add your message Here"
//           />
//         </div>
//
//         <div className={styles.buttonGroup}>
//           <button
//             className={`${styles.button} ${styles.backButton}`}
//             type="button"
//             onClick={handleBack}
//           >
//             Back
//           </button>
//           <button
//             className={`${styles.button} ${styles.reviewButton}`}
//             type="button"
//             onClick={submit}
//           >
//             Continue
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };
//
// export default OrderFlowers;
