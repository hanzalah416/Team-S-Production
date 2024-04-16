import React, { useEffect, useState } from "react";
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

export default function PathToTextDisplay(props: {
  startNode: string;
  endNode: string;
  algo: string;
}) {
  const [openLists, setOpenLists] = useState<boolean[]>([]);
  const [data, setData] = useState<Directions[]>([]);

  useEffect(() => {
    // Fetch data from the backend when the component mounts
    fetchData();
  });

  const fetchData = async () => {
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

      // Initialize the open state of each list
      setOpenLists(new Array(data.length).fill(false));
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  // Function to split the directions into separate lists based on direction type
  const splitDirections = () => {
    const lists: Directions[][] = [[]];
    let currentListIndex = 0;

    // Iterate over the directions
    data.forEach((direction) => {
      // If direction type is 5, start a new list
      if (direction.directionType === directionType.FloorSwitch) {
        lists[currentListIndex].push(direction);
        lists.push([]);
        currentListIndex++;
      } else {
        // Add direction to the current list
        lists[currentListIndex].push(direction);
      }
    });

    return lists;
  };

  // Toggle the open/closed state of a list
  const toggleList = (index: number) => {
    setOpenLists((prevState) =>
      prevState.map((state, idx) => (idx === index ? !state : state)),
    );
  };

  return (
    <List
      sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          Nested List Items
        </ListSubheader>
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
            <ListItemText primary={`List ${index + 1}`} />
            {openLists[index] ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          {/* Nested Collapse component for each list */}
          <Collapse in={openLists[index]} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {/* Render each direction in the list */}
              {list.map((direction, idx) => (
                <ListItemButton key={idx} sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <StarBorder />
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
