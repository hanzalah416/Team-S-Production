// OrderFlowers.tsx
import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
//import { useFormData } from "./useFormData";
//import {Simulate} from "react-dom/test-utils";
//import submit = Simulate.submit;
import axios from "axios";
import {Autocomplete, Button, InputLabel} from "@mui/material";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Unstable_Grid2";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";

import {flowerform} from "../common/flowerform.ts";


const OrderFlowers: React.FC = () => {
    const [patientName, setPatientName] = useState("");
    const [patientRoom, setPatientRoom] = useState("");

    const [locations, setLocations] = useState<Position[]>([]);

    const [setSubmittedEntries] = useState([]);
    const navigate = useNavigate();
    //const { formData, setFormData } = useFormData();

    /*const handleReviewOrder = () => {
        setFormData({
          ...formData,
          orderFlowers: {
            patientName,
            patientRoom,
            customMessage,
          },
        });
        navigate("/order-flowers-result");
      };*/

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


    async function submit() {
        if (patientName == "" || patientRoom == "") {
            alert("Please Fill out the Patient Name and Room Number");
            return;
        }

        const orderFlowerSent: flowerform = {
            patientName: patientName,
            PatientRoom: parseInt(patientRoom),
            customMessage: customMessage,
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
                navigate("/choose-flowers");
            })
            .catch(() => {
                console.log("Order failed to send");
                alert("Order failed to send. Please try again later.");
            });

        const newEntry = {
            PatientName: patientName,
            PatientRoom: patientRoom,
        };
        setSubmittedEntries((prevEntries) => [...prevEntries, newEntry]);

    }


    function clear() {
        setPatientName("");
        setPatientRoom("");


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
            <br/>
            <br/>

            <Paper elevation={4}>
                <br/>
                <p className={"title"}>Flower Order Form </p>
                <p className={"names"}></p>

                <Stack alignItems="center" justifyContent="center" spacing={4} p={4}>
                    <div>
                        <InputLabel
                            style={{
                                color: "#3B54A0",
                            }}
                            id="demo-simple-select-label"
                        >
                            Name
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
                                setPatientName(event.target.value);
                            }}
                            sx={{minWidth: 300}}
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
                                    sx={{minWidth: 300}}
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
                            onChange={(event, value) => setPatientRoom(value.label)}
                        />
                    </div>
                    <div>
                        <InputLabel
                            style={{
                                color: "#3B54A0",
                            }}
                            id="location-dropdown"
                        >
                            Phone Number
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
                                setPatientName(event.target.value);
                            }}
                            sx={{minWidth: 300}}
                        />
                    </div>


                    <Stack
                        spacing={2}
                        direction="row"
                        alignItems="center"
                        justifyContent="center"
                    >


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
                            Next
                        </Button>
                    </Stack>
                </Stack>
            </Paper>
            <br/>
            <br/>
            <br/>
        </Grid>

        // <div className={styles.container}>
        //   <h2 className={styles.title}>Order Flowers</h2>
        //   <form>
        //     <div className={styles.inputRow}>
        //       <div className={styles.formGroup}>
        //         <label className={styles.label}>Patient Name</label>
        //         <input
        //           className={styles.input}
        //           type="text"
        //           value={patientName}
        //           onChange={(e) => setPatientName(e.target.value)}
        //           placeholder="Add Name Here"
        //         />
        //       </div>
        //       <div className={styles.formGroup}>
        //         <label className={styles.label}>Patient Room</label>
        //         <input
        //           className={styles.input}
        //           type="number"
        //           value={patientRoom}
        //           onKeyDown={(e) =>
        //             (e.keyCode === 69 || e.keyCode === 190) && e.preventDefault()
        //           }
        //           onChange={(e) => setPatientRoom(e.target.value)}
        //           placeholder="Room Number Here"
        //         />
        //       </div>
        //     </div>
        //     <div className={styles.formGroup}>
        //       <label className={styles.label}>Custom Message (optional)</label>
        //       <textarea
        //         className={`${styles.input} ${styles.largeTextarea}`}
        //         value={customMessage}
        //         onChange={(e) => setCustomMessage(e.target.value)}
        //         placeholder="Add your message Here"
        //       />
        //     </div>
        //
        //     <div className={styles.buttonGroup}>
        //       <button
        //         className={`${styles.button} ${styles.backButton}`}
        //         type="button"
        //         onClick={handleBack}
        //       >
        //         Back
        //       </button>
        //       <button
        //         className={`${styles.button} ${styles.reviewButton}`}
        //         type="button"
        //         onClick={submit}
        //       >
        //         Continue
        //       </button>
        //     </div>
        //   </form>
        // </div>
    );
};

export default OrderFlowers;
