import React, { useState, useEffect } from "react";
import styles from "./FloorMap.module.css";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { Box, Button } from "@mui/material";
import l1Map from "../assets/HospitalMap/00_thelowerlevel1.png";
import l2Map from "../assets/HospitalMap/00_thelowerlevel2.png";
import f1Map from "../assets/HospitalMap/01_thefirstfloor.png";
import f2Map from "../assets/HospitalMap/02_thesecondfloor.png";
import f3Map from "../assets/HospitalMap/03_thethirdfloor.png";

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

interface FloorSwitcherProps {
  onChange: (floor: string) => void;
}

interface Tag {
  tag: string;
  index: number;
}

function FloorMap() {
  const [locations, setLocations] = useState<Position[]>([]);
  const [currentFloor, setCurrentFloor] = useState("01");
  const sortedLocations = [...locations]
    .filter((location) => !location.label.includes("Hall")) // Change startsWith to includes
    .sort((a, b) => a.label.localeCompare(b.label));

  const [startPosition, setStartPosition] = useState<Position | null>(null);

  const [endPosition, setEndPosition] = useState<Position | null>(null);
  // const [queueNodeIDs, setQueueNodeIDs] = useState<string[]>([]);
  const [pathFound, setPathFound] = useState(true);
  const [filteredQueueNodeIDs, setFilteredQueueNodeIDs] = useState<string[]>(
    [],
  );
  const [fullPath, setFullPath] = useState<string[]>([]);
  const getTagsFromPath = (path: string[]) => {
    const floorOrder = ["L1", "L2", "01", "02", "03"];
    const startFloor = path[0] ? getFloorNumber(path[0]) : null;
    const tags: (null | { index: number; tag: string })[] = [
      {
        tag: startFloor,
        index: startFloor ? floorOrder.indexOf(startFloor) : -1,
      },
      ...path
        .filter((nodeID) => nodeID && nodeID.length === 3)
        .sort((a, b) => floorOrder.indexOf(a) - floorOrder.indexOf(b))
        .map((tag) => ({ tag, index: floorOrder.indexOf(tag) + 1 })),
    ]
      .map(({ tag, index }) => {
        if (tag === null) {
          return null;
        }
        const finalTag = typeof tag === "string" ? tag : "";
        return {
          tag: finalTag ? finalTag.slice(-2) : "",
          index,
        };
      })
      .filter((tag): tag is Tag => tag !== null);
    return tags;
  };

  const getFloorNumber = (nodeID: string) => {
    const floor = nodeID.slice(-2); // Get the last two characters
    switch (floor) {
      case "01":
        return "01";
      case "02":
        return "02";
      case "03":
        return "03";
      case "L1":
        return "L1";
      case "L2":
        return "L2";
      default:
        return "00"; // Default case, should not happen
    }
  };

  const clearInputs = () => {
    setStartPosition(null);
    setEndPosition(null);
    setFilteredQueueNodeIDs([]); // Clear filtered node IDs for each floor
    setFullPath([]); // Clear the full path
    setPathFound(true);
    setResetKey((prevKey) => prevKey + 1); // Increment the reset key
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
      if (!value) {
        throw new Error("Value was undefined was undefined");
      }

      const selectedFloor = getFloorNumber(value.id); // Get the floor of the selected start point
      setCurrentFloor(selectedFloor!);
      setStartPosition(value);
      if (value && endPosition) {
        fetchPath(value.id, endPosition.id);
      }
    } else {
      setEndPosition(value);
      if (value && startPosition) {
        fetchPath(startPosition.id, value.id);
      }
    }
  };

  const fetchPath = (startNode: string, endNode: string) => {
    fetch("/api/pathfind", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        startNode: startNode,
        endNode: endNode,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log("Pathfinding result node IDs:", data.id); // Print the node IDs to the console

        // Insert floor change markers into the full path
        const pathWithFloorChanges = [];
        for (let i = 0; i < data.id.length - 1; i++) {
          const currentFloor = getFloorNumber(data.id[i]);
          const nextFloor = getFloorNumber(data.id[i + 1]);
          pathWithFloorChanges.push(data.id[i]);
          if (currentFloor !== nextFloor) {
            const floorChangeMarker =
              (parseInt(nextFloor!) > parseInt(currentFloor!) ? "+" : "-") +
              nextFloor;
            pathWithFloorChanges.push(floorChangeMarker);
          }
        }
        pathWithFloorChanges.push(data.id[data.id.length - 1]); // Add the last node ID

        setFullPath(pathWithFloorChanges); // Store the full path with floor change markers

        // Filter the node IDs for the current floor, including floor change markers
        setFilteredQueueNodeIDs(
          pathWithFloorChanges.filter(
            (id) => getFloorNumber(id) === currentFloor || id.length === 3,
          ),
        );
        setPathFound(pathWithFloorChanges.length > 0);
      })
      .catch((error) => {
        console.error("Failed to find path:", error);
        setFilteredQueueNodeIDs([]);
        setPathFound(false);
      });
  };

  // let previousFloor = currentFloor;
  // Update the FloorSwitcher component to include a print statement
  const FloorSwitcher: React.FC<FloorSwitcherProps> = ({ onChange }) => (
    <div className={styles.floorSwitcher}>
      {["L1", "L2", "01", "02", "03"].map((floor) => {
        let displayFloor = floor;
        switch (floor) {
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
            key={floor}
            variant={currentFloor === floor ? "contained" : "outlined"}
            onClick={() => {
              setCurrentFloor(floor);
              const newFilteredQueueNodeIDs = fullPath.filter(
                (id) => getFloorNumber(id) === floor || id.length === 3,
              );
              setFilteredQueueNodeIDs(newFilteredQueueNodeIDs);
              onChange(floor);
            }}
            style={{
              marginRight: "2px",
              marginBottom: "5px",
              color: currentFloor === floor ? "white" : "black", // Text color
              backgroundColor: currentFloor === floor ? "#003b9c" : "#f1f1f1", // Background color
              borderColor: "black", // Border color
              fontFamily: "Poppins",
            }}
          >
            {displayFloor}
          </Button>
        );
      })}
    </div>
  );

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
            <div className={styles.boldtag2}>Floors for the Current Path:</div>
            <br />
            <div className={styles.floorButtonsContainer}>
              {getTagsFromPath(fullPath).map((tag) => {
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
          <TransformWrapper
          // initialScale={1.3}
          // initialPositionX={-200.4}
          // initialPositionY={-100.83}
          // centered
          >
            <TransformComponent>
              <img
                src={floorMaps[currentFloor as keyof typeof floorMaps]}
                alt="map"
                className={styles.hmapImage}
              />

              <div className={styles.dotsContainer}>
                {filteredQueueNodeIDs.map((nodeID, index) => {
                  if (nodeID.length === 3) {
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
                    const isMultifloorNode =
                      !isDisplayedStartNode &&
                      !isDisplayedEndNode &&
                      fullPath.includes(nodeID) &&
                      (getFloorNumber(nodeID) !==
                        getFloorNumber(filteredQueueNodeIDs[index - 1]) ||
                        getFloorNumber(nodeID) !==
                          getFloorNumber(filteredQueueNodeIDs[index + 1]));

                    let nodeColor;
                    if (
                      (isDisplayedStartNode && !isActualStartNode) ||
                      (isDisplayedEndNode && !isActualEndNode)
                    ) {
                      nodeColor = "purple";
                    } else if (isActualStartNode) {
                      nodeColor = "#19a300";
                    } else if (isActualEndNode) {
                      nodeColor = "red";
                    } else if (isMultifloorNode) {
                      nodeColor = "#fcec08";
                    } else {
                      nodeColor = "transparent";
                    }

                    let nextFloorLabel = "";
                    if (isMultifloorNode) {
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
                          nextFloorLabel = nextFloor.slice(-2); // Fallback for other floors like "L1", "L2"
                          break;
                      }
                    }

                    return (
                      <div
                        key={nodeID}
                        className={`${styles.mapDot} ${
                          isDisplayedStartNode ? styles.startNode : ""
                        } ${isDisplayedEndNode ? `${styles.endNode} ${styles.endNodeAnimation}` : ""} ${
                          isMultifloorNode ? styles.multifloorNode : ""
                        }`}
                        style={{
                          top: point.top,
                          left: point.left,
                          backgroundColor: nodeColor,
                          display: "block",
                        }}
                      >
                        {isMultifloorNode && (
                          <div className={styles.floorSwitchText}>
                            {nextFloorLabel}
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
          <div className={styles.floorSwitcherContainer}>
            <FloorSwitcher
              onChange={(floor: string) => setCurrentFloor(floor)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default FloorMap;
