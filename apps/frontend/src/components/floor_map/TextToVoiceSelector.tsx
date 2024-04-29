//Imports
import { useState } from "react";
import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";
import VolumeUp from "@mui/icons-material/VolumeUp";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import styles from "./FloorMap.module.css";
// import AudiotrackIcon from "@mui/icons-material/Audiotrack";
import Button from "@mui/material/Button";
import SpeedIcon from '@mui/icons-material/Speed';
import { PiWaveformFill } from "react-icons/pi";


interface Options {
  setValue: (value: number) => void;
  value: number;
  name: string;
  max: number;
  min: number;
}

interface VoiceOption {
  setValue: (value: number) => void;
  value: number;
}

export function TextToVoiceSelector(props: {
  options: Options[];
  voiceOption: VoiceOption;
}) {
  const voices = speechSynthesis.getVoices();

  const [open, setOpen] = useState(false);
  const handleSliderChange = (
    event: Event,
    newValue: number | number[],
    option: Options,
  ) => {
    option.setValue(newValue as number);
  };


  //Boolean that controls if the settings are visible
  const [showSelector, setShowSelector] = useState<boolean>(false);

  //Function to control turning the selector on and off
  function switchSelector() {
    showSelector ? setShowSelector(false) : setShowSelector(true);
  }
  function GetIcon(nameRaw: string) {
    const name = nameRaw.toLowerCase();
    switch (name) {
      case "volume":
        return <VolumeUp style={{ color: "black" }} />;
      case "pitch":
        return <PiWaveformFill style={{ color: "black", fontSize: '24px' }} />;
      case "rate":
        return (
          <SpeedIcon style={{ color: "black" }} />
        );
      default:
        return <VolumeUp className = {styles.Poppins} style={{ color: "black" }} />;
    }
  }

  return (
    <div>
      {/*Button to turn the selector on and off*/}
      <Button
        variant="outlined"
        onClick={switchSelector}
        className={styles.myCustomButton}
        style={{
          backgroundColor: showSelector ? "#163a95" : "#f1f1f1", // Changes color when clicked
          color: showSelector ? "#f1f1f1" : "#000",
          fontFamily: "Poppins",
          fontSize: 14,
          textAlign: "center",
          borderColor: "black",
          width: "100%",
          marginTop: "10px",
        }}
      >
        Voice Settings
      </Button>

        {showSelector && (
            <div>
                <ListItemButton onClick={() => setOpen(!open)}>
                    <ListItemText
                        primary="Choose Voice"
                        style={{ color: "black", fontWeight: "bold", fontSize: "16px" , textAlign: "left"}}
                    />
                    <ExpandMoreIcon
                        sx={{ transform: open ? "rotate(180deg)" : "none" }}
                        style={{ color: "black" }}
                    />
                </ListItemButton>
                <div className={styles.floorVoiceSettingContainer}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <List
                            component="div"
                            disablePadding
                            sx={{ width: "380px", maxWidth: 380, bgcolor: "#efefef" }}
                        >
                            {voices.map((voice, index) => (
                                <ListItemButton
                                    key={index}
                                    sx={{ pl: 4 }}
                                    onClick={() => {
                                        props.voiceOption.setValue(index);
                                        console.log(index);
                                    }}
                                >
                                    <ListItemText
                                        primary={voice.name}
                                        style={{ color: "black", fontSize: "16px" }}
                                    />
                                </ListItemButton>
                            ))}
                        </List>
                    </Collapse>
                </div>

                {props.options.map((option: Options) => (
                    <Box sx={{ width: "100%" }}>
                        <Typography id="input-slider" gutterBottom color={"black"}>

                        </Typography>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item>{GetIcon(option.name)}</Grid>
                            <Grid item xs>
                                <Slider
                                    max={option.max}
                                    min={option.min}
                                    step={0.1}
                                    value={typeof option.value === "number" ? option.value : 0}
                                    onChange={(event, newValue) =>
                                        handleSliderChange(event, newValue, option)
                                    }
                                    aria-labelledby="input-slider"

                                    sx={{
                                        '& .MuiSlider-thumb': {
                                            color: '#163a95', // Changes the thumb color
                                        },
                                        '& .MuiSlider-track': {
                                            color: '#6d92e7', // Changes the color of the track
                                        },
                                        '& .MuiSlider-rail': {
                                            color: '#ccc' // Optional: change the color of the rail if needed
                                        }
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                ))}
            </div>
        )}
    </div>
  );
}
