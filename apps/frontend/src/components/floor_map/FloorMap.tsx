import React, { lazy, Suspense, useCallback, useEffect, useState } from "react";
import styles from "./FloorMap.module.css";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import {
  Box,
  Button,
  FormControlLabel,
  MenuItem,
  Select,
  Switch,
} from "@mui/material";
import l1Map from "../assets/HospitalMap/00_thelowerlevel1.png";
import l2Map from "../assets/HospitalMap/00_thelowerlevel2.png";
import f1Map from "../assets/HospitalMap/01_thefirstfloor.png";
import f2Map from "../assets/HospitalMap/02_thesecondfloor.png";
import f3Map from "../assets/HospitalMap/03_thethirdfloor.png";
import PathToTextDisplay from "./PathToTextDisplay.tsx";

const MiniMap = lazy(() => import("./MiniMap.tsx"));

interface Position {
  label: string;
  id: string;
  top: string;
  left: string;
  floor: string;
}

interface Node {
  xcoord: string;
  ycoord: string;
  id: string;
  longName: string;
  floor: string;
}

// interface FloorSwitcherProps {
//   onChange: (floor: string) => void;
// }

// interface Tag {
//   tag: string;
//   index: number;
// }

function FloorMap() {
  const [resetFloorsUIKey, setResetFloorsUIKey] = useState(0);
  const [algorithm, setAlgorithm] = useState("astar");
  const [locations, setLocations] = useState<Position[]>([]);
  const [currentFloor, setCurrentFloor] = useState("01");
  const sortedLocations = [...locations]
    .filter((location) => !location.label.includes("Hall")) // Change startsWith to includes
    .sort((a, b) => a.label.localeCompare(b.label));
  console.log(sortedLocations);
  const [startPosition, setStartPosition] = useState<Position | null>(null);
  const [endPosition, setEndPosition] = useState<Position | null>(null);
  const [pathFound, setPathFound] = useState(true);
  const [filteredQueueNodeIDs, setFilteredQueueNodeIDs] = useState<string[]>(
    [],
  );
  const [fullPath, setFullPath] = useState<string[]>([]);
  const [showNodes, setShowNodes] = useState(false);

  const handleNodeClick = (node: Position | null) => {
    console.log("Node clicked:", node);
    const formatFloor = (floor: string) => {
      // Prepend '0' if the floor is '1', '2', or '3'
      return ["1", "2", "3"].includes(floor) ? `0${floor}` : floor;
    };

    if (!startPosition) {
      // Directly use handleSelection to manage setting start position
      handleSelection(node, "start");
      // Optionally, change floor to the selected node's floor
      // This is already handled inside handleSelection, so it might be redundant here
    } else if (!endPosition) {
      // Use handleSelection to manage setting end position
      handleSelection(node, "end");
      // Toggle node visibility off and change floor to the start node's floor
      setShowNodes(false); // This will hide the nodes
      // The floor change to start position's floor is already handled by handleSelection
      setCurrentFloor(formatFloor(startPosition.floor));
    }
  };

  const toggleNodesVisibility = () => {
    clearInputs();
    setShowNodes(!showNodes);
  };

  //{styles.mapDot}

  const renderFloorNodes = () => {
    if (!showNodes) return null;

    // Function to format floor strings by removing leading zeros
    const formatFloor = (floor: string) => {
      if (floor === "01" || floor === "02" || floor === "03") {
        return floor.substring(1); // Removes the leading '0'
      }
      return floor;
    };

    // Map dimensions
    const mapWidth = 5000; // Example width, adjust as necessary
    const mapHeight = 3400; // Example height, adjust as necessary

    // Current floor formatted to remove leading zeros if necessary
    const formattedCurrentFloor = formatFloor(currentFloor);
    const nodesOnCurrentFloor = sortedLocations.filter(
      (node) => node.floor === formattedCurrentFloor,
    );

    return nodesOnCurrentFloor.map((node) => {
      // Determine the background color based on whether the node is the start position
      const isStartNode = startPosition && node.id === startPosition.id;
      const nodeColor = isStartNode ? "green" : startPosition ? "red" : "green";

      const tooltipText = `${node.label}, ${node.id}`;

      return (
        <div
          key={node.id}
          className={styles.mapDot}
          style={{
            top: `${(parseInt(node.top) / mapHeight) * 100}%`, // Convert ycoord to percentage
            left: `${(parseInt(node.left) / mapWidth) * 100}%`, // Convert xcoord to percentage
            position: "absolute",
            zIndex: 1000, // Ensure it's visible above other elements
            cursor: "pointer", // Cursor indicates it's clickable
            borderRadius: "50%", // Makes the div circular
            backgroundColor: nodeColor, // Dynamic color based on the node status
          }}
          onClick={() => handleNodeClick(node)}
          title={tooltipText} // Enhanced tooltip with label and ID
        ></div>
      );
    });
  };

  const handleAlgorithmChange = async (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    const newAlgorithm = event.target.value;
    setAlgorithm(newAlgorithm);

    // Clear the previous path and related UI components before fetching new data
    setFullPath([]);
    setFilteredQueueNodeIDs([]);

    if (startPosition && endPosition) {
      // Fetch the new path with the updated algorithm
      await fetchPath(startPosition.id, endPosition.id);
      console.log(`Algorithm changed to ${newAlgorithm}. New path fetched.`);
      setCurrentFloor(getFloorNumber(startPosition.id));
    } else {
      console.log(
        "Either start or end position is not set, unable to fetch new path.",
      );
    }
  };

  const handleFloorChange = (floor: string) => {
    setCurrentFloor(floor);
    const newFilteredQueueNodeIDs = fullPath.filter(
      (id) => getFloorNumber(id) === floor || id.length === 3,
    );
    setFilteredQueueNodeIDs(newFilteredQueueNodeIDs);
  };

  const getTagsFromPath = (path: string[]) => {
    const floorOrder = ["L1", "L2", "01", "02", "03"];

    // Starting with the start floor if it exists
    const startFloor = path[0] ? getFloorNumber(path[0]) : null;
    let tags = startFloor
      ? [{ tag: startFloor, index: floorOrder.indexOf(startFloor) }]
      : [];

    // Continue with the rest of the path, focusing on floor change markers
    const additionalTags = path
      .filter((nodeID) => nodeID.length === 3) // Ensure only floor change markers are processed
      .map((nodeID) => {
        const tag = getFloorNumber(nodeID);
        return {
          tag: tag,
          index: floorOrder.indexOf(tag),
        };
      });

    // Combine the starting floor with the rest of the tags
    tags = tags.concat(additionalTags);

    // Mapping for display, removing leading zeros
    return tags.map(({ tag, index }) => ({
      tag: tag,
      display: tag.replace(/^0/, ""), // Removing leading zeros for display
      index,
    }));
  };

  const getFloorNumber = (nodeID: string) => {
    // Get the last two characters
    return nodeID.slice(-2);
  };

  const clearInputs = () => {
    setStartPosition(null);
    setEndPosition(null);
    setFilteredQueueNodeIDs([]); // Clear filtered node IDs for each floor
    setFullPath([]); // Clear the full path
    setPathFound(true);
    setResetKey((prevKey) => prevKey + 1); // Increment the reset key
    setResetFloorsUIKey((prevKey) => prevKey + 1);
  };
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    fetch("/api/nodes")
      .then((response) => response.json())
      .then((nodes: Node[]) => {
        const formattedLocations: Position[] = nodes.map((node) => ({
          label: node.longName || "Unknown",
          id: node.id,
          top: `${node.ycoord}px`,
          left: `${node.xcoord}px`,
          floor: node.floor,
        }));
        setLocations(formattedLocations);
      })
      .catch((error) => console.error("Failed to fetch node data:", error));
  }, []);

  const getPositionById = (id: string): Position => {
    const position = locations.find((location) => location.id === id);
    if (position) {
      return {
        ...position,
        top: `${(parseInt(position.top, 10) / 3400) * 100}%`,
        left: `${(parseInt(position.left, 10) / 5000) * 100}%`,
      };
    }
    return { label: "", id: "", top: "0%", left: "0%", floor: "" };
  };

  const toggleScrolling = (disableScroll: boolean) => {
    if (disableScroll) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  };

  const handleSelection = (value: Position | null, type: "start" | "end") => {
    if (type === "start") {
      setStartPosition(value);
      if (value) {
        const selectedFloor = getFloorNumber(value.id);
        setCurrentFloor(selectedFloor);
        if (endPosition) {
          // Fetch path between new start and existing end
          fetchPath(value.id, endPosition.id);
        }

        // Filter the full path for the new floor based on the selected start position
        const newFilteredQueueNodeIDs = fullPath.filter(
          (id) => getFloorNumber(id) === selectedFloor || id.length === 3,
        );
        setFilteredQueueNodeIDs(newFilteredQueueNodeIDs);
      }
    } else if (type === "end") {
      setEndPosition(value);
      if (value && startPosition) {
        // Fetch path with new end and existing start
        fetchPath(startPosition.id, value.id);
        // Ensure that we return to the floor of the start position
        setCurrentFloor(getFloorNumber(startPosition.id));
      }
    }
  };

  const fetchPath = useCallback(
    async (startNode: string, endNode: string) => {
      if (!startNode || !endNode) return null;

      setResetFloorsUIKey((prevKey) => prevKey + 1);

      try {
        const response = await fetch("/api/pathfind", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            startNode: startNode,
            endNode: endNode,
            algorithm: algorithm,
          }),
        });
        const data = await response.json();
        const pathWithFloorChanges = [];
        for (let i = 0; i < data.id.length - 1; i++) {
          const currentFloor = getFloorNumber(data.id[i]);
          const nextFloor = getFloorNumber(data.id[i + 1]);
          pathWithFloorChanges.push(data.id[i]);
          if (currentFloor !== nextFloor) {
            pathWithFloorChanges.push(
              (parseInt(nextFloor) > parseInt(currentFloor) ? "+" : "-") +
                nextFloor,
            );
          }
        }
        pathWithFloorChanges.push(data.id[data.id.length - 1]); // Add the last node ID
        setResetFloorsUIKey((prevKey) => prevKey + 1);
        setFullPath(pathWithFloorChanges);
        setFilteredQueueNodeIDs(
          pathWithFloorChanges.filter(
            (id) =>
              getFloorNumber(id) === getFloorNumber(startNode) ||
              id.length === 3,
          ),
        );
        setPathFound(pathWithFloorChanges.length > 0);

        return pathWithFloorChanges;
      } catch (error) {
        console.error("Failed to find path:", error);
        setFullPath([]);
        setFilteredQueueNodeIDs([]);
        setPathFound(false);
        return null;
      }
    },
    [algorithm],
  );

  useEffect(() => {
    if (startPosition && endPosition) {
      fetchPath(startPosition.id, endPosition.id);
    }
  }, [fetchPath, startPosition, endPosition]);

  const getLineColor = (floor: string) => {
    switch (floor) {
      default:
        return "blue"; // Default color
    }
  };

  const floorMaps = {
    L1: l1Map,
    L2: l2Map,
    "01": f1Map,
    "02": f2Map,
    "03": f3Map,
  };

  const getLineSegments = (startNodeID: string, endNodeID: string) => {
    const segments = [];
    let currentFloor = getFloorNumber(startNodeID);
    let segmentStartNodeID = startNodeID;

    for (let i = 1; i < filteredQueueNodeIDs.length; i++) {
      const nodeID = filteredQueueNodeIDs[i];
      const nodeFloor = getFloorNumber(nodeID);

      // Skip creating segments if the current node is a floor change marker
      if (nodeID.length === 3) {
        continue;
      }

      if (nodeFloor !== currentFloor) {
        // Floor change detected, create a segment for the current floor
        segments.push({
          startNodeID: segmentStartNodeID,
          endNodeID: nodeID,
          floor: currentFloor,
        });
        currentFloor = nodeFloor; // Update the current floor
        segmentStartNodeID = nodeID; // Update the segment start node ID
      }

      if (nodeID === endNodeID) {
        // End node reached, create the final segment for the current floor
        segments.push({
          startNodeID: segmentStartNodeID,
          endNodeID: nodeID,
          floor: currentFloor,
        });
        break;
      }
    }

    return segments;
  };

  //for slide in of mini map
  const [mapChecked, setMapChecked] = React.useState(true);
  const handleChange = () => {
    setMapChecked((prev) => !prev);
  };

  return (
    <div className={styles.wholePage}>
      <div className={styles.container}>
        <div className={styles.signInForm}>
          <div className={styles.boldtag}>Enter Starting Point</div>
          <Autocomplete
            key={`start-position-${resetKey}`}
            options={sortedLocations}
            getOptionLabel={(option) => option.label || "Unknown"}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={startPosition}
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
            onChange={(event, value) => handleSelection(value, "start")}
          />
          <div className={styles.boldtag}>Enter Destination</div>
          <Autocomplete
            key={`end-position-${resetKey}`}
            options={sortedLocations}
            getOptionLabel={(option) => option.label || "Unknown"}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={endPosition}
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
            onChange={(event, value) => handleSelection(value, "end")}
          />

          <Button
            variant="outlined"
            className={styles.clearButton}
            onClick={clearInputs}
            style={{
              marginTop: "10px",
              backgroundColor: "#f1f1f1",
              color: "#000",
              fontFamily: "Poppins",
              fontSize: 14,
              textAlign: "center",
              borderColor: "black",
            }}
          >
            Clear Path
          </Button>
          <Box className={styles.directionsBox}>Directions</Box>
          {!pathFound && (
            <Box className={styles.pathNotFoundBox}>Path not found</Box>
          )}

          <div className={styles.boldtag2}>
            <PathToTextDisplay
              startNode={"FHALL02901"}
              endNode={"DINFO00102"}
              algo={algorithm}
            />

            <div className={styles.boldtag2}>Floors for the Current Path:</div>
            <br />
            <div
              key={resetFloorsUIKey}
              className={styles.floorButtonsContainer}
            >
              {getTagsFromPath(fullPath).map((tag) => {
                // console.log("Full path:", fullPath);
                // console.log("Current tag:", tag);
                if (!tag) {
                  throw new Error("Tag was undefined");
                }
                let displayFloor = tag.tag;
                switch (tag.tag) {
                  case "01":
                    displayFloor = "1";
                    break;
                  case "02":
                    displayFloor = "2";
                    break;
                  case "03":
                    displayFloor = "3";
                    break;
                  default:
                    break; // Keep "L1" and "L2" as is
                }

                return (
                  <Button
                    key={tag.tag}
                    variant={
                      currentFloor === tag.tag ? "contained" : "outlined"
                    }
                    onClick={() => {
                      setCurrentFloor(tag.tag);

                      // Filter the full path for the new floor
                      const newFilteredQueueNodeIDs = fullPath.filter(
                        (id) =>
                          getFloorNumber(id) === tag.tag || id.length === 3,
                      );
                      setFilteredQueueNodeIDs(newFilteredQueueNodeIDs);
                    }}
                    style={{
                      marginBottom: "5px",
                      marginTop: "3px",
                      color: currentFloor === tag.tag ? "white" : "black", // Text color
                      backgroundColor:
                        currentFloor === tag.tag ? "#003b9c" : "#f1f1f1", // Background color with transparency
                      borderColor: "black", // Border color
                      fontFamily: "Poppins",
                      textAlign: "center",
                    }}
                  >
                    {displayFloor}
                  </Button>
                );
              })}
            </div>
          </div>

          <div className={styles.mbDiv}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Button
                variant="contained"
                href="/node-data"
                className={styles.csvButton}
                style={{
                  backgroundColor: "#003b9c",
                  fontFamily: "Poppins",
                  fontSize: 14,
                  textAlign: "center",
                }}
              >
                Import/Export Nodes
              </Button>
            </div>
          </div>
        </div>

        <div className={styles.mapArea}>
          <div className={styles.MapButtons}>
            <div className={styles.mMapbox}>
              <FormControlLabel
                control={
                  <Switch
                    checked={mapChecked}
                    onChange={handleChange}
                    sx={{
                      fontSize: 9,
                      "& .MuiSwitch-switchBase": {
                        // Thumb color when unchecked
                        "&.Mui-checked": {
                          color: "#003b9c", // Thumb color when checked
                        },
                        "&.Mui-checked + .MuiSwitch-track": {
                          backgroundColor: "#0251d4", // Track color when checked
                        },
                      },
                    }}
                  />
                }
                label="Level Select"
              />
            </div>
            <div className={styles.mMapbox}>
              <FormControlLabel
                control={
                  <Switch
                    checked={showNodes}
                    onChange={toggleNodesVisibility}
                    name="showNodes"
                    sx={{
                      fontSize: 9,
                      "& .MuiSwitch-switchBase": {
                        // Thumb color when unchecked
                        "&.Mui-checked": {
                          color: "#003b9c", // Thumb color when checked
                        },
                        "&.Mui-checked + .MuiSwitch-track": {
                          backgroundColor: "#0251d4", // Track color when checked
                        },
                      },
                    }}
                  />
                }
                label="Toggle Nodes"
              />
            </div>
            <Select
              value={algorithm}
              onChange={handleAlgorithmChange}
              displayEmpty
              inputProps={{ "aria-label": "Select Pathfinding Algorithm" }}
              sx={{
                marginBottom: "10px",
                fontFamily: "Poppins",
                fontSize: 12,
                colorSecondary: "red",
              }}
            >
              <MenuItem value="astar">A* Search</MenuItem>
              <MenuItem value="bfs">Breadth-First Search</MenuItem>
              <MenuItem value="dfs" /*disabled style={{ color: 'gray' }}*/>
                Depth-First Search
              </MenuItem>
              <MenuItem value="dijkstra">Dijkstra's Algorithm</MenuItem>
            </Select>
          </div>

          <TransformWrapper
          // initialScale={1.3}
          // initialPositionX={-200.4}
          // initialPositionY={-100.83}
          // centered
          >
            <TransformComponent>
              {renderFloorNodes()}
              <img
                src={floorMaps[currentFloor as keyof typeof floorMaps]}
                alt="map"
                className={styles.hmapImage}
              />

              <div className={styles.dotsContainer}>
                {filteredQueueNodeIDs.map((nodeID, index) => {
                  if (nodeID.length === 3) {
                    // Skip floor change markers
                    return null;
                  }

                  const point = getPositionById(nodeID);
                  if (point) {
                    const isActualStartNode = fullPath[0] === nodeID;
                    const isActualEndNode =
                      fullPath[fullPath.length - 1] === nodeID;
                    const isDisplayedStartNode = index === 0;

                    const isDisplayedEndNode =
                      index === filteredQueueNodeIDs.length - 1;
                    const isMultifloorEndNode =
                      !isDisplayedStartNode &&
                      !isDisplayedEndNode &&
                      fullPath.includes(nodeID) &&
                      (getFloorNumber(nodeID) !==
                        getFloorNumber(filteredQueueNodeIDs[index - 1]) ||
                        getFloorNumber(nodeID) !==
                          getFloorNumber(filteredQueueNodeIDs[index + 1]));

                    const isMultifloorStartNode =
                      index > 0 &&
                      filteredQueueNodeIDs[index - 1].length === 3 &&
                      !isActualEndNode;

                    let nodeColor,
                      lastFloorLabel = "";
                    if (isMultifloorStartNode) {
                      nodeColor = "MediumOrchid"; // Set color to purple for intermediary start nodes
                      const fullPathIndex = fullPath.indexOf(nodeID);
                      if (fullPathIndex !== -1 && fullPathIndex > 1) {
                        const targetNodeID = fullPath[fullPathIndex - 2];
                        lastFloorLabel = targetNodeID.slice(-2);
                        switch (lastFloorLabel) {
                          case "01":
                            lastFloorLabel = "1";
                            break;
                          case "02":
                            lastFloorLabel = "2";
                            break;
                          case "03":
                            lastFloorLabel = "3";
                            break;
                        }
                        // Extract the last two characters
                        // console.log(lastFloorLabel);
                      }
                    } else if (isActualStartNode) {
                      nodeColor = "#19a300"; // Green for the actual start node
                    } else if (isActualEndNode) {
                      nodeColor = "red"; // Red for the actual end node
                      // Print the nodes around the actual end node if it's not near the start of the array
                      const fullPathIndex = fullPath.indexOf(nodeID);
                      if (fullPathIndex !== -1 && fullPathIndex > 1) {
                        // Additional logic to check the length of the node before the end node
                        if (fullPath[fullPathIndex - 1].length === 3) {
                          // Check if the preceding node is a floor change marker
                          // Log the node before the marker
                        }
                      }
                    } else if (isMultifloorEndNode) {
                      nodeColor = "#fcec08"; // Yellow for multifloor nodes
                    } else {
                      nodeColor = "transparent"; // Transparent for other nodes
                    }

                    let nextFloorLabel = "";
                    if (isMultifloorEndNode) {
                      const nextNodeID = filteredQueueNodeIDs[index + 1];
                      const nextFloor = getFloorNumber(nextNodeID);
                      switch (nextFloor) {
                        case "01":
                          nextFloorLabel = "1";
                          break;
                        case "02":
                          nextFloorLabel = "2";
                          break;
                        case "03":
                          nextFloorLabel = "3";
                          break;
                        default:
                          if (!nextFloor) {
                            throw new Error("Next floor was null");
                          }
                          nextFloorLabel = nextFloor.slice(-2); // Extract floor from ID
                          break;
                      }
                    }

                    return (
                      <div
                        key={nodeID}
                        className={`${styles.mapDot} ${
                          isDisplayedStartNode || isDisplayedEndNode
                            ? styles.endNodeAnimation
                            : ""
                        } ${isDisplayedStartNode ? styles.startNode : ""} ${
                          isDisplayedEndNode ? styles.endNode : ""
                        } ${
                          isMultifloorEndNode || isMultifloorStartNode
                            ? styles.multifloorNode
                            : ""
                        }`}
                        style={{
                          top: point.top,
                          left: point.left,
                          backgroundColor: nodeColor,
                          display: "block",
                        }}
                      >
                        {(isMultifloorEndNode || isMultifloorStartNode) && (
                          <div className={styles.floorSwitchText}>
                            {isMultifloorStartNode
                              ? lastFloorLabel
                              : nextFloorLabel
                                ? nextFloorLabel
                                : ""}
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
              <svg
                className={styles.pathSvg}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                }}
              >
                {filteredQueueNodeIDs
                  .slice(0, -1) // Exclude the last node ID as it's used as the end node for the last segment
                  .map((startNodeID, index) => {
                    const endNodeID = filteredQueueNodeIDs[index + 1];

                    // Only get segments for non-floor-change nodes
                    if (startNodeID.length !== 3 && endNodeID.length !== 3) {
                      const segments = getLineSegments(startNodeID, endNodeID);

                      return segments.map((segment, segmentIndex) => {
                        const startPoint = getPositionById(segment.startNodeID);
                        const endPoint = getPositionById(segment.endNodeID);
                        const lineColor = getLineColor(segment.floor!);

                        return (
                          <line
                            key={`${segment.startNodeID}-${segment.endNodeID}-${segmentIndex}`}
                            className={styles.line}
                            x1={`${parseFloat(startPoint.left)}%`}
                            y1={`${parseFloat(startPoint.top)}%`}
                            x2={`${parseFloat(endPoint.left)}%`}
                            y2={`${parseFloat(endPoint.top)}%`}
                            strokeLinecap="round"
                            stroke={lineColor}
                            strokeWidth="2"
                          />
                        );
                      });
                    }

                    return null;
                  })}
              </svg>
            </TransformComponent>
          </TransformWrapper>

          <div
            className={`${styles.mMap} ${mapChecked ? styles.showMMap : ""}`}
          >
            <Suspense fallback={<div>MiniMap loading please wait...</div>}>
              <MiniMap onChangeFloor={handleFloorChange} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FloorMap;
