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
import FormLabel from "@mui/material/FormLabel";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import Paper from "@mui/material/Paper";
import axios from "axios";
import BackgroundImg2 from "../../assets/blue-background2.jpg";
import styles from "../../login/Login.module.css";
import teddybear from "../../assets/GiftPhotos/teddybeargift.png";
import coloringbook from "../../assets/GiftPhotos/coloringbook.webp";
import fruit from "../../assets/GiftPhotos/fruitgift.png";
import Tooltip from "../../ToolTip";
import { Position } from "../../common/PositionInterface.ts";
import { Node } from "../../common/NodeInterface.ts";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";

const tips = `Name of Requester: Enter the full name of the person requiring language assistance.

Priority: Click on the dropdown menu to indicate the urgency of the request. The options may include urgent, high, medium, or low.

Location: Use the dropdown to select the location where the language services are needed. This might refer to a specific department, office, or event location.

Gift Type: Choose the type of gift you are requesting.

Enter Custom Message: If you’d like to include a message with the gift enter that information here.

Status: If the form allows for setting a status, select the current status of the request, like 'new', 'pending', 'approved', or 'completed'.`;

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

    interface Desc {
        desc: string;
    }

    interface Location {
        location: string | number;
    }

    interface LocationDesc extends Location, Desc {}

    const River: LocationDesc = {
        location: 17,
        desc: "This is an image I took during my time in Tokyo in 2019. It was taken after I just finished working on a large production for a major brand. I had a lot of fun shooting that day so this shot after work is always memorable to me. Somewhere in western Tokyo..",
    };

    const Train: LocationDesc = {
        location: "Somewhere on the Yamanote Line, Tokyo",
        desc: "This is an image I took on the train in Tokyo. It was taken on the Yamanote Line - one of the most popular train lines in Tokyo. It runs in a huge circle around Tokyo's most popular train stops and acts as lifeline for people to transfer to other lines. I don't think I was expecting this kid to rush out of the train when I was taking this photo but it works!",
    };

    const Ral: LocationDesc = {
        location: "Shibuya Game Center, Tokyo",
        desc: "This is an image I took in a game center in Tokyo. I was shooting a lookbook for a brand and thought it would be a fun location. Game centers in Japan are a sensory overload, there are plenty of different kinds of games to play. I had just beaten my friend Ral, the model at Mario Kart just after taking this photo.",
    };

    const Denwa: LocationDesc = {
        location: "Mishima station, Shizouka",
        desc: "I took this photo on a trip to visit my host family in the countryside. There are so many nostagalic places and things in Japan, but this stood out to me after I arrived at their local station - several hours away from Tokyo, by the base of Mt. Fuji.",
    };

    const Hana: LocationDesc = {
        location: "Shibuya Underpass, Tokyo",
        desc: " I took this photo with some friends in Shibuya under an overpass. My friend owns a flower shop and after a long day of shooting we decieded to have some fun and burn these to get some cool images. Needless to say we got plenty of weird looks.",
    };

    const Kohei: LocationDesc = {
        location: "Toyosu Bridge, Tokyo",
        desc: " This was from that earlier shoot for my friends flower shop. He makes custom arranged flowers for fashion brands, weddings, and events. We were shooting a collaboration between his shop and another brand. This was a really cool location because it reminded me of skylines in any older anime and had a moody feel. Featured one of my best friends, Kohei.",
    };

    //Comment this out to use the interface portion of the code//
    //Type Guard//
    let x: Location = {
        location: 10,
    };

    let y: Desc = {
        desc: "This is an image I took during my time in Tokyo in 2019. It was taken after I just finished working on a large production for a major brand. I had a lot of fun shooting that day so this shot after work is always memorable to me. Somewhere in western Tokyo..",
    };

    function locationF(): string {
        if (typeof x.location === "string") {
            return x.location;
        } else {
            return "Location Unknown";
        }
    }

    function descF(): string {
        if (typeof y.desc === "string") {
            return y.desc;
        } else {
            return "No Description Available";
        }
    }


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
          <p className={"title"} style={{ position: "relative" }}>
            Gift Request Form
            <Tooltip
              style={{ position: "absolute", right: "40px", top: 0 }}
              tips={tips}
            />
          </p>
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



                <Splide aria-label="My Favorite Images">
                    <SplideSlide>
                        <div className="img__wrap">
                            <img className="img__img" src={river} alt="1" />
                            <div className="img__desc">
                                <p>{descF()}</p>
                                <br />
                                <br />
                                <p>Location: {locationF()}</p>
                            </div>
                        </div>
                    </SplideSlide>
                    <SplideSlide>
                        <div className="img__wrap">
                            <img className="img__img" src={train} alt="2" />
                            <div className="img__desc">
                                <p>{Train.desc}</p>
                                <br />
                                <br />
                                <p>Location: {Train.location}</p>
                            </div>{" "}
                        </div>
                    </SplideSlide>
                    <SplideSlide>
                        <div className="img__wrap">
                            <img className="img__img" src={ral} alt="3" />
                            <div className="img__desc">
                                <p>{Ral.desc}</p>
                                <br />
                                <br />
                                <p>Location: {Ral.location}</p>
                            </div>{" "}
                        </div>{" "}
                    </SplideSlide>
                    <SplideSlide>
                        <div className="img__wrap">
                            <img className="img__img" src={denwa} alt="4" />
                            <div className="img__desc">
                                <p>{Denwa.desc}</p>
                                <br />
                                <br />
                                <p>Location: {Denwa.location}</p>
                            </div>{" "}
                        </div>{" "}
                    </SplideSlide>
                    <SplideSlide>
                        <div className="img__wrap">
                            <img className="img__img" src={hana} alt="5" />
                            <div className="img__desc">
                                <p>{Hana.desc}</p>
                                <br />
                                <br />
                                <p>Location: {Hana.location}</p>
                            </div>{" "}
                        </div>{" "}
                    </SplideSlide>
                    <SplideSlide>
                        <div className="img__wrap">
                            <img className="img__img" src={kohei} alt="6" />
                            <div className="img__desc">
                                <p>{Kohei.desc}</p>
                                <br />
                                <br />
                                <p>Location: {Kohei.location}</p>
                            </div>{" "}
                        </div>{" "}
                    </SplideSlide>
                </Splide>{" "}




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
