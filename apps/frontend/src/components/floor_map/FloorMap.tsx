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

function FloorMap() {
    const [locations, setLocations] = useState<Position[]>([]);
    const [currentFloor, setCurrentFloor] = useState("1");
    const sortedLocations = [...locations]
        .filter((location) => !location.label.startsWith("Hall"))
        .sort((a, b) => a.label.localeCompare(b.label));
    const [startPosition, setStartPosition] = useState<Position | null>(null);
    const [endPosition, setEndPosition] = useState<Position | null>(null);
    const [queueNodeIDs, setQueueNodeIDs] = useState<string[]>([]);
    const [pathFound, setPathFound] = useState(true);
    const [filteredQueueNodeIDs, setFilteredQueueNodeIDs] = useState<string[]>([]);


    const getFloorNumber = (nodeID) => {
        const floor = nodeID.slice(-2); // Get the last two characters
        switch (floor) {
            case "01":
                return "1";
            case "02":
                return "2";
            case "03":
                return "3";
            case "L1":
                return "-1";
            case "L2":
                return "-2";
            default:
                return "0"; // Default case, should not happen
        }
    };



    const clearInputs = () => {
        setStartPosition(null);
        setEndPosition(null);
        setQueueNodeIDs([]);
        setFilteredQueueNodeIDs([]); // Clear filtered node IDs for each floor
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



    const fetchPath = (startNodeId: string, endNodeId: string) => {
        fetch("/api/pathfind", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                startNodeID: startNodeId,
                endNodeID: endNodeId,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Pathfinding result node IDs:", data.id); // Print the node IDs to the console
                setQueueNodeIDs(data.id);
                // Filter the node IDs for the current floor
                setFilteredQueueNodeIDs(data.id.filter((id) => getFloorNumber(id) === parseInt(currentFloor, 10)));

                setPathFound(data.id.length > 0);
            })
            .catch((error) => {
                console.error("Failed to find path:", error);
                setQueueNodeIDs([]);
                setFilteredQueueNodeIDs([]);
                setPathFound(false);
            });
    };



    let previousFloor = currentFloor;
    // Update the FloorSwitcher component to include a print statement
    const FloorSwitcher = ({ onChange }) => (
        <div className={styles.floorSwitcher}>
            {["L1", "L2", "1", "2", "3"].map((floor) => (
                <Button
                    key={floor}
                    variant={currentFloor === floor ? "contained" : "outlined"}
                    onClick={() => {
                        // Print the previous floor and node ID before changing floors
                        console.log(`Floor switched from ${previousFloor} to ${floor}`);
                        console.log(`Node ID before switch: ${queueNodeIDs[0]}`);
                        console.log(`Node ID after switch: ${queueNodeIDs[queueNodeIDs.length - 1]}`);
                        previousFloor = floor;
                        setCurrentFloor(floor);
                        setStartPosition(null); // Reset start position
                        setEndPosition(null);   // Reset end position
                        // Filter the node IDs for the new floor
                        const newFilteredQueueNodeIDs = queueNodeIDs.filter((id) => id.endsWith(floor));
                        setFilteredQueueNodeIDs(newFilteredQueueNodeIDs);
                        onChange(floor);
                    }}
                >
                    {floor}
                </Button>
            ))}
        </div>
    );


    const getLineColor = (floor) => {
        switch (floor) {
            case 1:
                return "red";
            case 2:
                return "green";
            case 3:
                return "blue";
            case -1:
                return "purple";
            case -2:
                return "orange";
            // Add more cases as needed for other floors
            default:
                return "black"; // Default color
        }
    };


    const floorMaps = {
        L1: l1Map,
        L2: l2Map,
        1: f1Map,
        2: f2Map,
        3: f3Map,
    };

    const getLineSegments = (startNodeID, endNodeID) => {
        const segments = [];
        let currentFloor = getFloorNumber(startNodeID);
        let segmentStartNodeID = startNodeID;

        for (let i = 1; i < filteredQueueNodeIDs.length; i++) {
            const nodeID = filteredQueueNodeIDs[i];
            const nodeFloor = getFloorNumber(nodeID);

            if (nodeFloor !== currentFloor) {
                // Floor change detected, create a segment for the current floor
                segments.push({ startNodeID: segmentStartNodeID, endNodeID: nodeID, floor: currentFloor });
                currentFloor = nodeFloor; // Update the current floor
                segmentStartNodeID = nodeID; // Update the segment start node ID
            }

            if (nodeID === endNodeID) {
                // End node reached, create the final segment for the current floor
                segments.push({ startNodeID: segmentStartNodeID, endNodeID: nodeID, floor: currentFloor });
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
                                label="Enter Starting Point"
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
                                label="Enter Destination"
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
                    <Box className={styles.directionsBox}>Directions</Box>
                    {!pathFound && (
                        <Box className={styles.pathNotFoundBox}>Path not found</Box>
                    )}

                    <FloorSwitcher onChange={(floor) => setCurrentFloor(floor)}/>

                    <Button
                        variant="outlined"
                        className={styles.clearButton}
                        onClick={clearInputs}
                        style={{
                            marginTop: "10px",
                            backgroundColor: "#f5f5f5",
                            color: "#000",
                            fontFamily: "Poppins",
                            fontSize: 14,
                            textAlign: "center",
                        }}
                    >
                        Clear

                    </Button>

                    <div className={styles.boldtag}>
                        <div className={styles.pathListContainer}>
                            <ul className={styles.pathList}>
                                {filteredQueueNodeIDs.map((nodeID) => (
                                    <li key={nodeID}>{nodeID}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className={styles.mbDiv}>
                        <div style={{display: "flex", flexDirection: "column"}}>
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
                        initialScale={1.3}
                        initialPositionX={-200.4}
                        initialPositionY={-100.83}
                        centered
                    >
                        <TransformComponent>
                            <img
                                src={floorMaps[currentFloor]}
                                alt="map"
                                className={styles.hmapImage}
                            />

                            <div className={styles.dotsContainer}>
                                {filteredQueueNodeIDs.map((nodeID, index) => {
                                    const point = getPositionById(nodeID);
                                    if (point) {
                                        const isStartNode = index === 0;
                                        const isEndNode = index === filteredQueueNodeIDs.length - 1;
                                        const isMultifloorNode =
                                            !isStartNode &&
                                            !isEndNode &&
                                            (getFloorNumber(nodeID) !== getFloorNumber(filteredQueueNodeIDs[index - 1]) ||
                                                getFloorNumber(nodeID) !== getFloorNumber(filteredQueueNodeIDs[index + 1]));

                                        if (!isMultifloorNode && getFloorNumber(nodeID) !== currentFloor) {
                                            return null; // Skip rendering if not on the correct floor
                                        }

                                        return (
                                            <div
                                                key={nodeID}
                                                className={`${styles.mapDot} ${
                                                    isStartNode ? styles.startNode : ""
                                                } ${
                                                    isEndNode ? styles.endNode : ""
                                                } ${
                                                    isMultifloorNode ? styles.multifloorNode : ""
                                                }`}
                                                style={{
                                                    top: point.top,
                                                    left: point.left,
                                                    backgroundColor:
                                                        isStartNode ? "green"
                                                            : isEndNode ? "red"
                                                                : isMultifloorNode ? "yellow"
                                                                    : "transparent",
                                                    display: "block",
                                                }}
                                            ></div>
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
                                        const segments = getLineSegments(startNodeID, endNodeID);

                                        return segments.map((segment, segmentIndex) => {
                                            const startPoint = getPositionById(segment.startNodeID);
                                            const endPoint = getPositionById(segment.endNodeID);
                                            const lineColor = getLineColor(segment.floor);

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
                                    })}
                            </svg>

                        </TransformComponent>
                    </TransformWrapper>
                </div>
            </div>
        </div>
    );
}

export default FloorMap;
