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
    const [currentFloor, setCurrentFloor] = useState("L1");
    const sortedLocations = [...locations]
        .filter((location) => location.floor === currentFloor)
        .filter((location) => !location.label.startsWith("Hall"))
        .sort((a, b) => a.label.localeCompare(b.label));

    const [startPosition, setStartPosition] = useState<Position | null>(null);
    const [endPosition, setEndPosition] = useState<Position | null>(null);
    const [queueNodeIDs, setQueueNodeIDs] = useState<string[]>([]);
    const [pathFound, setPathFound] = useState(true);

    const clearInputs = () => {
        setStartPosition(null);
        setEndPosition(null);
        setQueueNodeIDs([]);
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
        setQueueNodeIDs([]);
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
                setQueueNodeIDs(data.id);
                setPathFound(data.id.length > 0);
            })
            .catch((error) => {
                console.error("Failed to find path:", error);
                setQueueNodeIDs([]);
                setPathFound(false);
            });
    };

    const FloorSwitcher = ({ onChange }) => (
        <div className={styles.floorSwitcher}>
            {["L1", "L2", "1", "2", "3"].map((floor) => (
                <Button
                    key={floor}
                    variant={currentFloor === floor ? "contained" : "outlined"}
                    onClick={() => onChange(floor)}
                >
                    {floor}
                </Button>
            ))}
        </div>
    );

    const floorMaps = {
        L1: l1Map,
        L2: l2Map,
        1: f1Map,
        2: f2Map,
        3: f3Map,
    };

    return (
        <div className={styles.wholePage}>
            <FloorSwitcher onChange={(floor) => setCurrentFloor(floor)} />
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

                    <FloorSwitcher onChange={(floor) => setCurrentFloor(floor)} />

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
                                {queueNodeIDs.map((nodeID, index) => {
                                    const point = getPositionById(nodeID);
                                    if (
                                        point &&
                                        (index === 0 || index === queueNodeIDs.length - 1)
                                    ) {
                                        return (
                                            <div
                                                key={nodeID}
                                                className={`${styles.mapDot} ${
                                                    index !== 0 && index !== queueNodeIDs.length - 1
                                                        ? styles.small
                                                        : ""
                                                }`}
                                                style={{
                                                    top: point.top,
                                                    left: point.left,
                                                    backgroundColor:
                                                        index === 0
                                                            ? "green"
                                                            : index === queueNodeIDs.length - 1
                                                                ? "red"
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
                                {queueNodeIDs
                                    .slice(0)
                                    .reverse()
                                    .map((nodeID, index) => {
                                        const point = getPositionById(nodeID);
                                        if (point && index < queueNodeIDs.length - 1) {
                                            const nextPoint = getPositionById(
                                                queueNodeIDs[queueNodeIDs.length - index - 2]
                                            );
                                            if (nextPoint) {
                                                return (
                                                    <line
                                                        key={`${nodeID}-${index}`}
                                                        className={styles.line}
                                                        x1={`${parseFloat(nextPoint.left)}%`}
                                                        y1={`${parseFloat(nextPoint.top)}%`}
                                                        x2={`${parseFloat(point.left)}%`}
                                                        y2={`${parseFloat(point.top)}%`}
                                                        strokeLinecap="round"
                                                        stroke="blue"
                                                        strokeWidth="2"
                                                    />
                                                );
                                            }
                                        }
                                        return null;
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
