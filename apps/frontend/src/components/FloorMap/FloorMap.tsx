import React, { useState, useEffect } from "react";
import styles from "./FloorMap.module.css";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { Box } from "@mui/material";
import { parse } from "csv-parse/browser/esm/sync";

interface Position {
  label: string;
  id: string;
  top: string;
  left: string;
}

interface LocationData {
  nodeID: string;
  xcoord: string;
  ycoord: string;
  floor: string;
  building: string;
  nodeType: string;
  longName: string;
  shortName: string;
}

function FloorMap() {
  const [locations, setLocations] = useState<Position[]>([]);
  const [startPosition, setStartPosition] = useState<Position | null>(null);
  const [endPosition, setEndPosition] = useState<Position | null>(null);
  const [queueNodeIDs, setQueueNodeIDs] = useState<string[]>([]); // Initialize as empty array
  const [pathFound, setPathFound] = useState(true);

  useEffect(() => {
    // Fetch node IDs from the backend
    fetch("/api/queueNodeIDs")
      .then((response) => response.json())
      .then((nodeIDs) => setQueueNodeIDs(nodeIDs))
      .catch((error) => console.error("Failed to fetch node IDs:", error));

    fetch("src/components/FloorMap/L1Nodes.csv")
      .then((response) => response.text())
      .then((csvData) => {
        const parsedData: LocationData[] = parse(csvData, {
          columns: true,
          skip_empty_lines: true,
        });

        const formattedLocations: Position[] = parsedData.map(
          (location: LocationData) => ({
            label: location.longName,
            id: location.nodeID,
            top: `${(parseInt(location.ycoord, 10) / 3400) * 100}%`,
            left: `${(parseInt(location.xcoord, 10) / 5000) * 100}%`,
          }),
        );

        setLocations(formattedLocations);
      });
  }, []);

  const getPositionById = (id: string) => {
    return locations.find((location) => location.id === id);
  };

  const toggleScrolling = (disableScroll: boolean) => {
    if (disableScroll) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  };

  const handleSelection = (value: Position | null, type: "start" | "end") => {
    const newStartId = type === "start" ? value?.id : startPosition?.id;
    const newEndId = type === "end" ? value?.id : endPosition?.id;

    if (type === "start") {
      setStartPosition(value);
    } else {
      setEndPosition(value);
    }

    if (newStartId && newEndId) {
      setQueueNodeIDs([]);

      fetch("/api/pathfind", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startNodeID: newStartId,
          endNodeID: newEndId,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Path:", data.id);
          setQueueNodeIDs(data.id);
          setPathFound(data.id.length > 0);
        })
        .catch((error) => {
          console.error("Failed to find path:", error);
          setQueueNodeIDs([]);
          setPathFound(false);
        });
    }
  };

  return (
    <div className={styles.wholePage}>
      <div className={styles.container}>
        <div className={styles.signInForm}>
          <div className={styles.boldtag}>Enter Starting Point</div>
          <Autocomplete
            disablePortal
            options={locations}
            getOptionLabel={(option) => option.label}
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
            disablePortal
            options={locations}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Enter Destination"
                InputLabelProps={{
                  style: {
                    fontFamily: "Poppins",
                    fontSize: 14,
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
        </div>
        <div className={styles.mapArea}>
          <TransformWrapper
            initialScale={1.3}
            initialPositionX={-200.4}
            initialPositionY={-100.83}
          >
            <TransformComponent>
              <img
                src="/src/components/assets/HospitalMap/00_thelowerlevel1.png"
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
                        key={index}
                        className={`${styles.mapDot} ${index !== 0 && index !== queueNodeIDs.length - 1 ? styles.small : ""}`}
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
                        queueNodeIDs[queueNodeIDs.length - index - 2],
                      );
                      if (nextPoint) {
                        return (
                          <>
                            {/*<line*/}
                            {/*    key={`${index}-bg`}*/}
                            {/*    x1={`${parseFloat(nextPoint.left)}%`}*/}
                            {/*    y1={`${parseFloat(nextPoint.top)}%`}*/}
                            {/*    x2={`${parseFloat(point.left)}%`}*/}
                            {/*    y2={`${parseFloat(point.top)}%`}*/}
                            {/*    strokeLinecap="round"*/}
                            {/*    stroke="lightblue"*/}
                            {/*    strokeWidth="2"*/}
                            {/*/>*/}
                            <line
                              key={index}
                              className={styles.line}
                              x1={`${parseFloat(nextPoint.left)}%`}
                              y1={`${parseFloat(nextPoint.top)}%`}
                              x2={`${parseFloat(point.left)}%`}
                              y2={`${parseFloat(point.top)}%`}
                              strokeLinecap="round"
                              stroke="blue"
                              strokeWidth="2"
                            />
                          </>
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
