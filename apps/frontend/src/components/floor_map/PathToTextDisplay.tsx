import React, { useEffect, useState, useCallback } from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import Collapse from "@mui/material/Collapse";
import StarBorder from "@mui/icons-material/StarBorder";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Directions, directionType } from "../../../../backend/src/textPath.ts";
import TurnLeftIcon from "@mui/icons-material/TurnLeft";
import TurnRightIcon from "@mui/icons-material/TurnRight";
import StraightIcon from "@mui/icons-material/Straight";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import SyncIcon from "@mui/icons-material/Sync";
import FmdGoodIcon from "@mui/icons-material/FmdGood";

export default function PathToTextDisplay(props: {
  startNode: string;
  endNode: string;
  algo: string;
  onChangeFloor: (floor: string) => void;
}) {
  //Keep track of which lists are open
  const [openLists, setOpenLists] = useState<boolean[]>([]);
  const [data, setData] = useState<Directions[]>([]);
  const [currentFloor] = useState<string[]>([]);

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
    const floorLabel = currentFloor[index];
    console.log(`Toggling list for floor: ${floorLabel}`);

    // Map floor label "3" to "03", etc.
    const formattedFloorLabel = formatFloorLabel(floorLabel);

    setOpenLists((prevState) => {
      // Create a new array where all values are set to false
      const newState = prevState.map(() => false);

      // Set the value at the current index to the opposite of its current state
      // This ensures that only the list at the current index can be open at one time
      newState[index] = !prevState[index];

      // If the current list is now being opened
      if (!prevState[index]) {
        // Set the current floor on opening the list
        props.onChangeFloor(formattedFloorLabel);
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
        return <StarBorder />; // Default icon if direction type is not recognized
    }
  };

  return (
    <List
      sx={{ width: "380px", maxWidth: 380, bgcolor: "#fbfbfb" }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader
          component="div"
          id="nested-list-subheader"
        ></ListSubheader>
      }
    >
      {/* Map over the split lists of directions and render each list */}
      {splitDirections().map((list, index) => (
        <div key={index}>
          {/* Render a subheader for each list */}
          <ListItemButton onClick={() => toggleList(index)}>
            <ListItemIcon>
              <StarBorder />
            </ListItemIcon>
            <ListItemText primary={`Floor ${currentFloor[index]}`} />
            {openLists[index] ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          {/* Nested Collapse component for each list */}
          <Collapse in={openLists[index]} timeout="auto" unmountOnExit>
            {/* Allow for scrolling inside of the lists while still being able to see the others */}
            <List
              component="div"
              disablePadding
              style={{ maxHeight: "200px", overflow: "auto" }}
            >
              {/* Render each direction in the list */}
              {list.map((direction, idx) => (
                <ListItemButton key={idx} sx={{ pl: 4 }}>
                  <ListItemIcon>
                    {getIconForDirectionType(direction.directionType)}
                  </ListItemIcon>
                  {/* Assuming textDirection is a property of Directions */}
                  <ListItemText primary={direction.textDirection} />
                </ListItemButton>
              ))}
            </List>
          </Collapse>
        </div>
      ))}
    </List>
  );
}
