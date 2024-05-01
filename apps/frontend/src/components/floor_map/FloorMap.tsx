import React, {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useState,
  useRef,
} from "react";
import styles from "./FloorMap.module.css";
import {
  TransformWrapper,
  TransformComponent,
  ReactZoomPanPinchContentRef,
} from "react-zoom-pan-pinch";

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

import KeySelection from "./KeySelection.tsx";
import Tooltip from "../ToolTip";
import { TextToVoiceSelector } from "./TextToVoiceSelector.tsx";

import { Position } from "../common/PositionInterface.ts";
import { Node } from "../common/NodeInterface.ts";
import ll2 from "../assets/HmapNoBackground/00_thelowerlevel2_bg-rm.png";
import ll1 from "../assets/HmapNoBackground/00_thelowerlevel1_rm-bg.png";
import f1 from "../assets/HmapNoBackground/01_thefirstfloor_rm-bg.png";
import f2 from "../assets/HmapNoBackground/02_thesecondfloor_rm-bg.png";
import f3 from "../assets/HmapNoBackground/03_thethirdfloor_rm-bg.png";
import SpeechToText from "./SpeechToText.tsx";
import FloorSequenceDisplay from "./FloorSequenceDisplay.tsx";
import getMobileOperatingSystem from "../HelperFunctions/MobileCheck.ts";

const tips = `
**Enter Starting Point:**

-Click on the dropdown menu labeled "Enter Starting Point".
-Select the building or specific entrance where you are currently located from the provided list.


**Enter Destination:**

-Click on the dropdown menu labeled "Enter Destination".

-Choose the building or specific area you want to navigate to from the list.

**Mic:**

-You can use the microphone to input your destinations with your voice. Simply press the **mic button** and 
speak your start or end location.
-You can also say "nearest" or "closest" followed by a specific type that can be found in the map key
(e.g., **"nearest restroom"**). As long as a valid starting point is provided, the system will
direct you to the closest relevant location.





**Directions:**

- After selecting both your starting point and destination, the map will display
a highlighted path indicating the best route to take.
- If the path goes multiple levels, use the **"Level Select"** toggle to view
different floors and track the path through each level.


**Additional Features:**

-**“Toggle Nodes”** can be used to show or hide points of interest or decision points like elevators, stairs, and restrooms.

-**“Show Key”** may provide you with a legend to decipher different symbols or colors used on the map.

-**“A\\* Search”** might be an option to find the shortest path if the map includes a pathfinding algorithm; you can select it to optimize your route.

`;

const MiniMap = lazy(() => import("./MiniMap.tsx"));

function FloorMap() {
  const [resetFloorsUIKey, setResetFloorsUIKey] = useState(0);
  const [algorithm, setAlgorithm] = useState("astar");
  const [locations, setLocations] = useState<Position[]>([]);
  const [currentFloor, setCurrentFloor] = useState("01");

  const sortedLocations = [...locations]
    .filter((location) => !location.label.includes("Hall")) // Change startsWith to includes
    .sort((a, b) => a.label.localeCompare(b.label));
  const [startPosition, setStartPosition] = useState<Position | null>(null);
  const [endPosition, setEndPosition] = useState<Position | null>(null);
  const [pathFound, setPathFound] = useState(true);
  const [filteredQueueNodeIDs, setFilteredQueueNodeIDs] = useState<string[]>(
    [],
  );
  const [fullPath, setFullPath] = useState<string[]>([]);
  const [showNodes, setShowNodes] = useState(false);
  const [showMapKey, setShowMapKey] = useState(false);
  const transformRef = useRef<ReactZoomPanPinchContentRef>(null);
  const [shouldAutoZoom, setShouldAutoZoom] = useState(true);

  const [speechVolume, setSpeechVolume] = useState(1);
  const [speechPitch, setSpeechPitch] = useState(1);
  const [speechRate, setSpeechRate] = useState(1);
  const [speechVoice, setSpeechVoice] = useState(4);

  const zoomToPathSegment = useCallback(
    (segmentIndex: number) => {
      setShouldAutoZoom(false);

      // Adjust the logic to handle floor change markers correctly
      let currentSegment = 0;
      let startIndex = 0;
      let endIndex = fullPath.length;

      for (let i = 0; i < fullPath.length; i++) {
        if (fullPath[i].length === 3) {
          // Floor change markers
          if (currentSegment === segmentIndex) {
            endIndex = i;
            break;
          }
          currentSegment++;
          startIndex = i + 1;
        }
      }

      // Fetch all nodes within the segment
      const segmentNodes = fullPath
        .slice(startIndex, endIndex)
        .map((id) => locations.find((loc) => loc.id === id))
        .filter((loc) => loc);

      if (segmentNodes.length === 0) {
        console.log("No nodes found in the segment, unable to zoom.");
        return;
      }

      const mapWidth = 5000; // Full width of the map in pixels
      const mapHeight = 3400; // Full height of the map in pixels

      // Calculate bounding box of all nodes
      let minX = Infinity,
        maxX = -Infinity,
        minY = Infinity,
        maxY = -Infinity;

      segmentNodes.forEach((node) => {
        if (node) {
          // Check if node is not undefined
          const x = parseInt(node.left);
          const y = parseInt(node.top);
          if (!isNaN(x) && !isNaN(y)) {
            // Also check if the parsed values are valid numbers
            minX = Math.min(minX, x);
            maxX = Math.max(maxX, x);
            minY = Math.min(minY, y);
            maxY = Math.max(maxY, y);
          }
        }
      });

      const minXPercent = (minX / mapWidth) * 100;
      const maxXPercent = (maxX / mapWidth) * 100;
      const minYPercent = (minY / mapHeight) * 100;
      const maxYPercent = (maxY / mapHeight) * 100;

      setTimeout(() => {
        if (transformRef.current?.instance.wrapperComponent) {
          const wrapperWidth =
            transformRef.current.instance.wrapperComponent.clientWidth;
          const wrapperHeight =
            transformRef.current.instance.wrapperComponent.clientHeight;

          // Calculate the actual pixel values from percentages for the viewport
          const minX = (minXPercent / 100) * wrapperWidth;
          const maxX = (maxXPercent / 100) * wrapperWidth;
          const minY = (minYPercent / 100) * wrapperHeight;
          const maxY = (maxYPercent / 100) * wrapperHeight;

          const widthRatio = wrapperWidth / (maxX - minX);
          const heightRatio = wrapperHeight / (maxY - minY);
          const scale = Math.min(widthRatio, heightRatio, 8) * 0.85; // Limiting scale to a maximum of 8

          const centerX = (minX + maxX) / 2;
          const centerY = (minY + maxY) / 2;

          transformRef.current.setTransform(
            wrapperWidth / 2 - centerX * scale,
            wrapperHeight / 2 - centerY * scale,
            scale,
          );
        } else {
          console.log(
            "TransformWrapper's instance or wrapperComponent is undefined.",
          );
        }
      }, 100);
    },
    [fullPath, locations, transformRef, setShouldAutoZoom],
  );
  const [ThreeDView, setThreeDView] = useState(true);
  const calculateAndZoom = () => {
    const dotContainer = document.querySelector('[class^="_dotsContainer"]');
    if (!dotContainer) {
      console.log("No dot container element found.");
      return;
    }

    // Use attribute selector to find all elements where class starts with "_mapDot"
    const allDots = dotContainer.querySelectorAll('[class^="_mapDot"]');
    if (allDots.length === 0) {
      console.log("No dot elements found.");
      return;
    }

    let minX = Infinity,
      maxX = -Infinity,
      minY = Infinity,
      maxY = -Infinity;

    allDots.forEach((dot: Element) => {
      const style = (dot as HTMLElement).style;
      const top = parseFloat(style.top);
      const left = parseFloat(style.left);

      const containerWidth = dotContainer.clientWidth;
      const containerHeight = dotContainer.clientHeight;

      const actualTop = (top / 100) * containerHeight;
      const actualLeft = (left / 100) * containerWidth;

      minX = Math.min(minX, actualLeft);
      maxX = Math.max(maxX, actualLeft);
      minY = Math.min(minY, actualTop);
      maxY = Math.max(maxY, actualTop);
    });

    if (transformRef.current?.instance.wrapperComponent) {
      const wrapperWidth =
        transformRef.current.instance.wrapperComponent.clientWidth;
      const wrapperHeight =
        transformRef.current.instance.wrapperComponent.clientHeight;

      const widthRatio = wrapperWidth / (maxX - minX);
      const heightRatio = wrapperHeight / (maxY - minY);
      // Compute the scale and ensure it does not exceed 8
      const calculatedScale = Math.min(widthRatio, heightRatio) * 0.85;
      const scale = Math.min(calculatedScale, 8); // Ensuring scale never goes over 8

      const centerX = (minX + maxX) / 2;
      const centerY = (minY + maxY) / 2;

      transformRef.current.setTransform(
        wrapperWidth / 2 - centerX * scale,
        wrapperHeight / 2 - centerY * scale,
        scale,
      );
    } else {
      console.log(
        "TransformWrapper's instance or wrapperComponent is undefined.",
      );
    }
  };

  useEffect(() => {
    if (shouldAutoZoom) {
      const timer = setTimeout(() => {
        calculateAndZoom();
      }, 100); // A short delay to ensure DOM elements are rendered

      return () => clearTimeout(timer); // Cleanup the timeout if the component unmounts
    }
  }, [filteredQueueNodeIDs, shouldAutoZoom]);

  const handleNodeClick = (node: Position | null) => {
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
      setshowTDNodes(false);
      // The floor change to start position's floor is already handled by handleSelection
      setCurrentFloor(formatFloor(startPosition.floor));
    }
  };

  const toggleNodesVisibility = () => {
    setShouldAutoZoom(true);
    clearInputs();
    setShowNodes(!showNodes);
    setshowTDNodes(!showTDNodes);
  };

  const handleMapKeyVisibility = () => {
    setShowMapKey(!showMapKey);
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
    setShouldAutoZoom(true);
    setCurrentFloor(floor);

    const newFilteredQueueNodeIDs = fullPath.filter(
      (id) => getFloorNumber(id) === floor || id.length === 3,
    );
    setFilteredQueueNodeIDs(newFilteredQueueNodeIDs);
  };

  useEffect(() => {
    if (transformRef.current) {
      //this is the easiest fix trust
      transformRef.current.resetTransform(); // Reset zoom and pan settings
    }
  }, [currentFloor]);

  const getFloorNumber = (nodeID: string | undefined) => {
    // Get the last two characters
    if (nodeID) return nodeID!.slice(-2);
    else return "";
  };

  const clearInputs = () => {
    setStartPosition(null);
    setEndPosition(null);
    setFilteredQueueNodeIDs([]); // Clear filtered node IDs for each floor
    setFullPath([]); // Clear the full path
    setPathFound(true);
    setResetKey((prevKey) => prevKey + 1); // Increment the reset key
    setShouldAutoZoom(true);
    setResetFloorsUIKey((prevKey) => prevKey + 1);
    if (transformRef.current) {
      // This assumes resetTransform is available and correctly set up in the TransformWrapper
      transformRef.current.resetTransform();
    }
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
    setShouldAutoZoom(true);
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
    L2: l2Map,
    L1: l1Map,
    "01": f1Map,
    "02": f2Map,
    "03": f3Map,
  };

  const getLineSegments = (
    startNodeID: string,
    endNodeID: string,
    floor: string,
  ) => {
    const segments = [];
    let segmentStartNodeID = startNodeID;
    for (let i = 1; i < filteredQueueNodeIDs.length; i++) {
      const nodeID = filteredQueueNodeIDs[i];
      const nodeFloor = getFloorNumber(nodeID);
      // Skip creating segments if the current node is a floor change marker
      if (nodeID.length === 3) {
        continue;
      }
      if (nodeFloor !== floor) {
        // Floor change detected, create a segment for the current floor
        segments.push({
          startNodeID: segmentStartNodeID,
          endNodeID: nodeID,
          floor: floor,
        });
        floor = nodeFloor; // Update the current floor
        segmentStartNodeID = nodeID; // Update the segment start node ID
      }

      if (nodeID === endNodeID) {
        // End node reached, create the final segment for the current floor
        segments.push({
          startNodeID: segmentStartNodeID,
          endNodeID: nodeID,
          floor: floor,
        });
        break;
      }
    }

    return segments;
  };

  const getTDLineSegments = (
    startNodeID: string,
    endNodeID: string,
    floor: string,
  ) => {
    const segments = [];
    let segmentStartNodeID = startNodeID;
    let foundStartNode = false; // Flag to indicate if the starting node has been found
    for (let i = 1; i < fullPath.length; i++) {
      const nodeID = fullPath[i];
      const nodeFloor = getFloorNumber(nodeID);
      if (!foundStartNode && nodeID !== startNodeID) continue;
      else foundStartNode = true;

      if (nodeID.length === 3) {
        continue;
      }
      if (nodeID === endNodeID) {
        // End node reached, create the final segment for the current floor
        segments.push({
          startNodeID: segmentStartNodeID,
          endNodeID: nodeID,
          floor: nodeFloor,
        });
        break;
      }
      if (nodeFloor === floor) {
        segments.push({
          startNodeID: segmentStartNodeID,
          endNodeID: nodeID,
          floor: nodeFloor,
        });
        segmentStartNodeID = nodeID; // Update the segment start node ID
      }
    }
    return segments;
  };

  //for slide in of mini map
  const [mapChecked, setMapChecked] = React.useState(true);
  const handleChange = () => {
    setMapChecked((prev) => !prev);
  };
  // const [tdindivfloor, settdindivfloor] = React.useState(true);

  const handleThreeD = () => {
    handleChange();
    setThreeDView(!ThreeDView);
  };
  const [showTDNodes, setshowTDNodes] = useState(false);
  const renderTDFloorNodes = (floorCheck: string) => {
    if (!showTDNodes) return null;
    return sortedLocations
      .filter((node) => getFloorNumber(node.id) === floorCheck)
      .map((node) => {
        const isStartNode = startPosition && node.id === startPosition.id;
        let nodeColor = isStartNode ? "green" : startPosition ? "red" : "green";
        const tooltipText = `${node.label}, ${node.id}`;
        const xPercent = (parseInt(node.left) / 5000) * 100;
        const yPercent = (parseInt(node.top) / 3400) * 100;
        const floor = getFloorNumber(node.id);
        switch (floor) {
          case "03": {
            nodeColor = "blue";
            break;
          }
          case "02": {
            nodeColor = "darkblue";
            break;
          }
          case "01": {
            nodeColor = "blue";
            break;
          }
          case "L1": {
            nodeColor = "darkblue";
            break;
          }
          case "L2": {
            nodeColor = "blue";
            break;
          }
          default: {
            console.log("somethings fucking wrong");
            break;
          }
        }
        return (
          <div
            key={node.id}
            className={styles.mapDot}
            style={{
              position: "absolute",
              top: `${yPercent}%`,
              left: `${xPercent}%`,
              width: "4px",
              height: "4px",
              borderRadius: "50%",
              zIndex: 10, //Ensure it's visible above other elements
              cursor: "pointer", //Cursor indicates it's clickable
              backgroundColor: nodeColor, //Dynamic color based on the node status
            }}
            // onClick={() => handleNodeClick(node)}
            title={tooltipText} // Enhanced tooltip with label and ID
          ></div>
        );
      });
  };

  const tdFloorPath = (floor: string) => {
    const actualStartNode = fullPath[0];
    const actualEndNode = fullPath[fullPath.length - 1];
    return fullPath
      .filter((id) => getFloorNumber(id) === floor)
      .map((nodeID, index, filteredPath) => {
        if (nodeID.length === 3) {
          return null;
        }
        console.log(index);
        let nodeColor = "transparent";
        const point = getPositionById(nodeID);
        if (index === 0 && filteredPath[0] !== actualStartNode)
          nodeColor = "yellow";
        if (
          index === filteredPath.length - 1 &&
          filteredPath[filteredPath.length - 1] !== actualEndNode
        )
          nodeColor = "yellow";
        const isActualStart = actualStartNode === nodeID;
        const isActualEnd = actualEndNode === nodeID;
        let size = "4px";
        if (isActualStart) {
          nodeColor = "blue";
          size = "8px";
        }
        if (isActualEnd) {
          nodeColor = "red";
          size = "8px";
        }
        // const xc = parseFloat(point.left);
        // const yc = parseFloat(point.top);
        return (
          <div>
            <div
              key={nodeID}
              className={styles.mapDot}
              style={{
                top: point.top,
                left: point.left,
                width: size,
                height: size,
                backgroundColor: nodeColor,
                display: "block",
              }}
            ></div>
            {/*{nodeColor === "yellow" &&*/}
            {/*    <div*/}
            {/*        className={styles.vertlineContainer}*/}
            {/*        style={{*/}
            {/*            position: "absolute",*/}
            {/*            left: "0",*/}
            {/*            top: "0",*/}
            {/*            height: "100%",*/}
            {/*            width: "100%",*/}
            {/*        }}>*/}
            {/*        <div*/}
            {/*            className={styles.vertline}*/}
            {/*            style={{*/}
            {/*                width: "2px",*/}
            {/*                height: "7.5vh",*/}
            {/*                backgroundColor: "blue",*/}
            {/*                position: "absolute",*/}
            {/*                top: "parseFloat(point.top)",*/}
            {/*                left: "parseFloat(point.left)",*/}
            {/*                transform: "skew(20deg) rotate(-20deg) rotateX(-40deg)",*/}
            {/*            }}*/}
            {/*        ></div>*/}
            {/*    </div>*/}
            {/*    // <svg style={{zIndex: 10,*/}
            {/*    //     position: "absolute",*/}
            {/*    //     top: "0%",*/}
            {/*    //     left: "0%",*/}
            {/*    //     transform: "skew(20deg) rotate(-20deg) rotateX(-40deg)"*/}
            {/*    // }}>*/}
            {/*    //     <line className={styles.vertline}*/}
            {/*    //           x1={`${xc}%`}*/}
            {/*    //           y1={`${yc}%`}*/}
            {/*    //           x2={`${xc}%`}*/}
            {/*    //           y2={`100vh`}*/}
            {/*    //           style={{*/}
            {/*    //               zIndex: 1,}}*/}
            {/*    //           strokeLinecap="round"*/}
            {/*    //           stroke={"black"}*/}
            {/*    //           strokeWidth="2"/>*/}
            {/*    // </svg>}</div>);*/}
            {/*}*/}
          </div>
        );
      });
  };

  const tdLine = (floor: string) => {
    return (
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
        {fullPath
          .filter((id) => getFloorNumber(id) === floor)
          .map((nodeID, index, filteredPath) => {
            if (index === filteredPath.length - 1) return null;
            const endNodeID = filteredPath[index + 1];
            if (nodeID.length !== 3 && endNodeID.length !== 3) {
              const segments = getTDLineSegments(
                nodeID,
                endNodeID,
                getFloorNumber(nodeID),
              );
              if (segments === null) return null;
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
    );
  };

  return (
    <div className={styles.wholePage}>
      <div className={styles.container}>
        <div className={styles.signInForm}>
          <div className={styles.signInFormContainer}>
            <Tooltip className={styles.tips} tips={tips} />
          </div>
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

          {/*<Box className={styles.directionsBox2}>.</Box>*/}

          <div className={styles.clearButtonStuff}>
            {("SpeechRecognition" in window ||
              "webkitSpeechRecognition" in window) &&
              (window.SpeechGrammarList || window.webkitSpeechGrammarList) &&
              getMobileOperatingSystem() && (
                <SpeechToText
                  handleSelection={handleSelection}
                  startPosition={startPosition}
                  getPositionById={getPositionById}
                />
              )}

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
          </div>

          <TextToVoiceSelector
            options={[
              {
                name: "Volume",
                setValue: setSpeechVolume,
                max: 1,
                min: 0,
                value: speechVolume,
              },
              {
                name: "Rate",
                setValue: setSpeechRate,
                max: 2,
                min: 0.5,
                value: speechRate,
              },
              {
                name: "Pitch",
                setValue: setSpeechPitch,
                max: 2,
                min: 0.1,
                value: speechPitch,
              },
            ]}
            voiceOption={{
              setValue: setSpeechVoice,
              value: speechVoice,
            }}
          />
          <Box className={styles.directionsBox}>Directions</Box>
          {!pathFound && (
            <Box className={styles.pathNotFoundBox}>Path not found</Box>
          )}

          <div className={styles.boldtag2}>
            {/*<div className={styles.boldtag2}>Floors for the Current Path:</div>*/}

            <div
              key={resetFloorsUIKey}
              className={styles.floorButtonsContainer}
            >
              {startPosition && endPosition && (
                <PathToTextDisplay
                  startNode={startPosition.id}
                  endNode={endPosition.id}
                  algo={algorithm}
                  onChangeFloor={handleFloorChange} // Passing the method as a prop
                  zoomToSegment={zoomToPathSegment}
                  voice={speechVoice}
                  volume={speechVolume}
                  pitch={speechPitch}
                  rate={speechRate}
                />
              )}
            </div>
          </div>

          <div className={styles.mbDiv}>
            <div style={{ display: "flex", flexDirection: "column" }}></div>
          </div>
        </div>

        <div className={styles.mapArea}>
          <div className={styles.FloorSequence}>
            <FloorSequenceDisplay path={fullPath} />
          </div>

          <div className={styles.MapButtons}>
            <div className={styles.mMapbox}>
              {ThreeDView && (
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
              )}
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
            <div className={styles.mMapbox}>
              <FormControlLabel
                control={
                  <Switch
                    checked={showMapKey}
                    onChange={handleMapKeyVisibility}
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
                label="Show Key"
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
          {!ThreeDView && (
            <div className={styles.ThreeD}>
              <div className={styles.outerDiv}>
                <div className={styles.ll2}>
                  <img src={ll2} alt="map" />
                  {renderTDFloorNodes("L2")}
                  {tdFloorPath("L2")}
                  {tdLine("L2")}
                </div>
                <div className={styles.ll1}>
                  <img src={ll1} alt="map" /> {renderTDFloorNodes("L1")}
                  {tdFloorPath("L1")}
                  {tdLine("L1")}
                </div>
                <div className={styles.f1}>
                  <img src={f1} alt="map" /> {renderTDFloorNodes("01")}
                  {tdFloorPath("01")}
                  {tdLine("01")}
                </div>
                <div className={styles.f2}>
                  <img src={f2} alt="map" /> {renderTDFloorNodes("02")}
                  {tdFloorPath("02")}
                  {tdLine("02")}
                </div>
                <div className={styles.f3}>
                  <img src={f3} alt="map" /> {renderTDFloorNodes("03")}
                  {tdFloorPath("03")}
                  {tdLine("03")}
                </div>
                {/*</>}*/}
              </div>
            </div>
          )}
          {ThreeDView && (
            <TransformWrapper
              ref={transformRef} // Set the ref to access the instance
              initialScale={1}
              initialPositionX={0}
              initialPositionY={0}
            >
              {() => (
                <>
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
                                getFloorNumber(
                                  filteredQueueNodeIDs[index + 1],
                                ));

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
                              {(isMultifloorEndNode ||
                                isMultifloorStartNode) && (
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
                          if (
                            startNodeID.length !== 3 &&
                            endNodeID.length !== 3
                          ) {
                            const segments = getLineSegments(
                              startNodeID,
                              endNodeID,
                              getFloorNumber(startNodeID),
                            );

                            return segments.map((segment, segmentIndex) => {
                              const startPoint = getPositionById(
                                segment.startNodeID,
                              );
                              const endPoint = getPositionById(
                                segment.endNodeID,
                              );
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
                </>
              )}
            </TransformWrapper>
          )}
          <div
            className={`${styles.mMap} ${mapChecked ? styles.showMMap : ""}`}
          >
            <Suspense fallback={<div>MiniMap loading please wait...</div>}>
              <MiniMap onChangeFloor={handleFloorChange} />
            </Suspense>
          </div>

          <KeySelection
            startNode={startPosition?.id}
            showMapKey={showMapKey}
            getPositionById={getPositionById}
            handleSelection={handleSelection}
          />
        </div>
      </div>
      <Button
        className={styles.threeDpath}
        style={{
          backgroundColor: "rgb(0, 59, 156)",
          fontFamily: "Poppins",
          fontSize: "14px",
          textAlign: "center",
          color: "white",
        }}
        onClick={handleThreeD}
      >
        {ThreeDView ? "3D Pathfinding" : "2D Pathfinding"}
      </Button>
      {/*<Button className={styles.threeDpath}*/}
      {/*        style={{*/}
      {/*            top: "-7vh",*/}
      {/*            left: "40vw",*/}
      {/*            backgroundColor: "rgb(0, 59, 156)",*/}
      {/*            fontFamily: "Poppins",*/}
      {/*            fontSize: "14px",*/}
      {/*            textAlign: "center",*/}
      {/*            color: "white"}}*/}
      {/*        onClick={() => {settdindivfloor(!tdindivfloor);}}*/}
      {/*>{tdindivfloor ? "showing inside div" : "showing math function"}</Button>*/}
    </div>
  );
}

export default FloorMap;
