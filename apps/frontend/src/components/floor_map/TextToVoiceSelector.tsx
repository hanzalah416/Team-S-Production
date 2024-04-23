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

export function TextToVoiceSelector(props: { options: Options[] }) {
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

  return (
    <div>
      {/*Button to turn the selector on and off*/}
      <button onClick={switchSelector}></button>

      {showSelector && (
        <div>
          {props.options.map((option: Options) => (
            <Box sx={{ width: 250 }}>
              <Typography id="input-slider" gutterBottom color={"black"}>
                {option.name}
              </Typography>
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <VolumeUp style={{ color: "black" }} />
                </Grid>
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
