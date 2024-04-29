//Imports
import { useState } from "react";
import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";
import MuiInput from "@mui/material/Input";
import VolumeUp from "@mui/icons-material/VolumeUp";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import styles from "./FloorMap.module.css";
import AudiotrackIcon from "@mui/icons-material/Audiotrack";
import TurtleIcon from "../assets/Turtle.svg";

const Input = styled(MuiInput)`
  width: 42px;
`;

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

  const isMobile = navigator.userAgent.match(
    /(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i,
  );

  const [open, setOpen] = useState(false);
  const handleSliderChange = (
    event: Event,
    newValue: number | number[],
    option: Options,
  ) => {
    option.setValue(newValue as number);
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    option: Options,
  ) => {
    option.setValue(event.target.value === "" ? 0 : Number(event.target.value));
  };

  const handleBlur = (option: Options) => {
    if (option.value < option.min) {
      option.setValue(option.min);
    } else if (option.value > option.max) {
      option.setValue(option.max);
    }
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
        return <AudiotrackIcon style={{ color: "black" }} />;
      case "rate":
        return (
          <img src={TurtleIcon} alt="Turtle Icon" style={{ minHeight: 24 }} />
        );
      default:
        return <VolumeUp style={{ color: "black" }} />;
    }
  }

  return (
    <div>
      {/*Button to turn the selector on and off*/}
      {!isMobile && <br />}
      <button type="button" onClick={switchSelector} style={{ color: "black" }}>
        Voice Settings
      </button>

      {showSelector && (
        <div>
          <ListItemButton onClick={() => setOpen(!open)}>
            <ListItemText
              primary="Voices"
              style={{ color: "black", fontWeight: "bold", fontSize: "16px" }}
            />
            <ExpandMoreIcon
              sx={{ transform: open ? "rotate(180deg)" : "none" }}
              style={{ color: "black" }}
            />
          </ListItemButton>
          <div className={styles.floorVoiceSettingContainer}>
            {/*Dropdown to select the voice*/}

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
            <Box sx={{ width: 250 }}>
              <Typography id="input-slider" gutterBottom color={"black"}>
                {option.name}
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
                  />
                </Grid>
                <Grid item>
                  <Input
                    value={option.value}
                    size="small"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      handleInputChange(event, option)
                    }
                    onBlur={() => handleBlur(option)}
                    inputProps={{
                      step: 10,
                      min: 0,
                      max: 100,
                      type: "number",
                      "aria-labelledby": "input-slider",
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
