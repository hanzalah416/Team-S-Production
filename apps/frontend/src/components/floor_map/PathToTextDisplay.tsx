import React, { useCallback, useEffect, useState } from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Directions, directionType } from "../../../../backend/src/textPath.ts";
import TurnLeftIcon from "@mui/icons-material/TurnLeft";
import TurnRightIcon from "@mui/icons-material/TurnRight";
import StraightIcon from "@mui/icons-material/Straight";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import SyncIcon from "@mui/icons-material/Sync";
import FmdGoodIcon from "@mui/icons-material/FmdGood";
import styles from "./FloorMap.module.css";
import { GetEstimatedTime } from "../../../../backend/src/PathDistanceCalculater.ts";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";

export default function PathToTextDisplay(props: {
  startNode: string;
  endNode: string;
  algo: string;
  onChangeFloor: (floor: string) => void;
  zoomToSegment: (segmentIndex: number) => void;
}) {
  //Keep track of which lists are open
  const [openLists, setOpenLists] = useState<boolean[]>([]);
  const [data, setData] = useState<Directions[]>([]);
  const [currentFloor] = useState<string[]>([]);
  const [estimatedTime, setEstimatedTime] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch("/api/pathToText", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startNode: props.startNode,
          endNode: props.endNode,
          algorithm: props.algo,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      setData(data);
      setEstimatedTime(GetEstimatedTime(data));
      setOpenLists(new Array(data.length).fill(false));
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  }, [props.startNode, props.endNode, props.algo]); // Dependencies for useCallback

  useEffect(() => {
    fetchData();
  }, [props.startNode, props.endNode, props.algo, fetchData]);

  // Function to split the directions into separate lists based on direction type
  const splitDirections = () => {
    const lists: Directions[][] = [[]];
    let currentListIndex = 0;

    // Iterate over the directions
    data.forEach((direction) => {
      // If direction type is 5, start a new list
      if (direction.directionType === directionType.FloorSwitch) {
        currentFloor[currentListIndex + 1] = direction.floorEnd;
        lists[currentListIndex].push(direction);
        lists.push([]);
        currentListIndex++;
      } else {
        currentFloor[currentListIndex] = direction.floorStart;
        // Add direction to the current list
        lists[currentListIndex].push(direction);
      }
    });

    return lists;
  };

  // Toggle the open/closed state of a list
  const toggleList = (index: number) => {
    const isOpen = openLists[index]; // Check if the current list is open
    const floorLabel = currentFloor[index];
    console.log(`Toggling list for floor: ${floorLabel}`);

    // Map floor label "3" to "03", etc.
    const formattedFloorLabel = formatFloorLabel(floorLabel);

    setOpenLists((prevState) => {
      // Create a new array where all values are set to false to close all other lists
      const newState = prevState.map(() => false);

      // Toggle the current list state
      newState[index] = !prevState[index];

      // If the current list is being opened and was previously closed
      if (!isOpen) {
        // Set the current floor on opening the list
        props.onChangeFloor(formattedFloorLabel);
        props.zoomToSegment(index); // Zoom to the segment when the list is opened
      }

      return newState;
    });
  };

  // Helper function to format the floor label correctly
  const formatFloorLabel = (floorLabel: string) => {
    // Check if the label needs to be prefixed with "0"
    if (floorLabel.length === 1 && !isNaN(parseInt(floorLabel))) {
      return `0${floorLabel}`;
    }
    return floorLabel;
  };

  // Function to determine the icon based on direction type
  const getIconForDirectionType = (directionType: number) => {
    switch (directionType) {
      //Right
      case 0:
        return <TurnRightIcon />;
      //Left
      case 1:
        return <TurnLeftIcon />;
      //Forward
      case 4:
        return <StraightIcon />;
      //Floor Switch
      case 5:
        return <ImportExportIcon />;
      //Facing
      case 6:
        return <SyncIcon />;
      //End
      case 7:
        return <FmdGoodIcon />;
      // Add more cases as needed for other direction types
      default:
        return <DirectionsWalkIcon />; // Default icon if direction type is not recognized
    }
  };

  function speakDirections(direction: Directions) {
    let text: SpeechSynthesisUtterance;

    if (
      direction.directionType != directionType.Face &&
      direction.directionType != directionType.Ending
    ) {
      text = new SpeechSynthesisUtterance(
        direction.textDirection + " For " + direction.distance + " Feet",
      );
    } else {
      text = new SpeechSynthesisUtterance(direction.textDirection);
    }

    const voices = speechSynthesis.getVoices();

    text.voice = voices[1];

    speechSynthesis.speak(text);
  }

  return (
    <div className={styles.floorDirectionsContainer}>
      <List
        sx={{ width: "380px", maxWidth: 380, bgcolor: "#fbfbfb" }}
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader
            component="div"
            id="nested-list-subheader"
            style={{ color: "black", fontWeight: "bold" }} // Label is bold
          >
            Estimated Time:{" "}
            <span
              style={{ fontWeight: "normal" }} // Time value is normal weight
            >
              {estimatedTime} min
            </span>
          </ListSubheader>
        }
      >
        {/* Map over the split lists of directions and render each list */}
        {splitDirections().map((list, index) => (
          <div key={index}>
            {/* Render a subheader for each list */}
            <ListItemButton
              onClick={() => {
                toggleList(index); // Using the passed function
              }}
            >
              <ListItemIcon>
                <DirectionsWalkIcon />
              </ListItemIcon>
              <ListItemText primary={`Floor ${currentFloor[index]}`} />
              {openLists[index] ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            {/* Nested Collapse component for each list */}
            <Collapse in={openLists[index]} timeout="auto" unmountOnExit>
              <List
                component="div"
                disablePadding
                style={{ maxHeight: "200px", overflow: "auto" }}
              >
                {/* Render each direction in the list */}
                {list.map((direction: Directions, idx) => (
                  <ListItemButton
                    key={idx}
                    sx={{ pl: 4 }}
                    onClick={() => {
                      speakDirections(direction);
                    }}
                  >
                    <ListItemIcon>
                      {getIconForDirectionType(direction.directionType)}
                    </ListItemIcon>
                    {/* Assuming textDirection is a property of Directions */}
                    <ListItemText
                      primary={
                        direction.textDirection +
                        " (" +
                        direction.distance +
                        " Feet" +
                        ")"
                      }
                    />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          </div>
        ))}
      </List>
    </div>
  );
}
