import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./FloorMapDebug.module.css";
import { Button, FormControlLabel, Checkbox, Typography } from "@mui/material";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

// Importing map images
import l1Map from "../assets/HospitalMap/00_thelowerlevel1.png";
import l2Map from "../assets/HospitalMap/00_thelowerlevel2.png";
import f1Map from "../assets/HospitalMap/01_thefirstfloor.png";
import f2Map from "../assets/HospitalMap/02_thesecondfloor.png";
import f3Map from "../assets/HospitalMap/03_thethirdfloor.png";

// Interfaces
interface Node {
  xcoord: string;
  ycoord: string;
  id: string;
  longName: string;
  floor: string;
}

interface Edge {
  startNode: string;
  endNode: string;
}

interface NodeDetailsPopupProps {
  node: Node | null;
}

const StaticFloorMapDebug = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [currentFloor, setCurrentFloor] = useState("1");
  const [showNodes, setShowNodes] = useState(true);
  const [showEdges, setShowEdges] = useState(true);
  const [selectedNodeDetails, setSelectedNodeDetails] = useState<Node | null>(
    null,
  );

  const handleNodeClick = (nodeId: string) => {
    const node = nodes.find((node) => node.id === nodeId);
    if (node !== undefined) {
      setSelectedNodeDetails(node);
    } else {
      setSelectedNodeDetails(null); // Explicitly set to null if no node is found
    }
  };

  const NodeDetailsPopup: React.FC<NodeDetailsPopupProps> = ({ node }) => {
    const popupRef = useRef<HTMLDivElement>(null);

    const handleClose = useCallback(() => {
      setSelectedNodeDetails(null);
    }, []);

    const handleClickOutside = useCallback(
      (event: MouseEvent) => {
        // Use instanceof to check if event.target is a Node
        if (
          popupRef.current &&
          event.target instanceof Node &&
          !popupRef.current.contains(event.target)
        ) {
          handleClose();
        }
      },
      [handleClose],
    ); // Include all dependencies used inside the callback

    useEffect(() => {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [handleClickOutside]); // Depend on the memoized handleClickOutside

    if (!node) return null;

    return (
      <div className={styles.nodeDetailsPopupContainer} onClick={handleClose}>
        <div
          className={styles.nodeDetailsPopup}
          ref={popupRef}
          onClick={(e) => e.stopPropagation()}
        >
          <div>
            <strong>ID:</strong> {node.id}
          </div>
          <div>
            <strong>Name:</strong> {node.longName}
          </div>
          <div>
            <strong>Floor:</strong> {node.floor}
          </div>
          <div>
            <strong>X Coordinate:</strong> {node.xcoord}
          </div>
          <div>
            <strong>Y Coordinate:</strong> {node.ycoord}
          </div>
          <button onClick={handleClose} className={styles.customButton}>
            Close
          </button>
        </div>
      </div>
    );
  };

  const toggleBodyScroll = (lock: boolean) => {
    document.body.style.overflow = lock ? "hidden" : "auto";
  };

  // Effect to handle showing/hiding the node details popup
  useEffect(() => {
    if (selectedNodeDetails) {
      toggleBodyScroll(true); // Lock scroll when the popup is open
    } else {
      toggleBodyScroll(false); // Unlock scroll when the popup is closed
    }

    // Cleanup function to ensure scroll is enabled when the component unmounts
    return () => {
      toggleBodyScroll(false);
    };
  }, [selectedNodeDetails]);

  useEffect(() => {
    fetch("/api/nodes")
      .then((response) => response.json())
      .then((data) => {
        // console.log("Nodes fetched:", data); // Log the nodes data
        setNodes(data);
      })
      .catch((error) => console.error("Failed to fetch nodes:", error));

    fetch("/api/edges")
      .then((response) => response.json())
      .then((data) => {
        setEdges(data);
      })
      .catch((error) => console.error("Failed to fetch edges:", error));
  }, []);

  const floorMaps = {
    L1: l1Map,
    L2: l2Map,
    "1": f1Map,
    "2": f2Map,
    "3": f3Map,
  };

  const FloorSwitcher = () => {
    const floorOrder = ["L1", "L2", "1", "2", "3"];
    const sortedFloors = Object.keys(floorMaps).sort(
      (a, b) => floorOrder.indexOf(a) - floorOrder.indexOf(b),
    );

    return (
      <div className={styles.floorSwitcher}>
        {sortedFloors.map((floor) => (
          <Button
            key={floor}
            variant={currentFloor === floor ? "contained" : "outlined"}
            onClick={() => setCurrentFloor(floor)}
            style={{
              marginRight: "2px",
              marginBottom: "5px",
              color: currentFloor === floor ? "white" : "black",
              backgroundColor: currentFloor === floor ? "#003b9c" : "#f1f1f1",
              borderColor: "black",
              fontFamily: "Poppins",
            }}
          >
            {floor}
          </Button>
        ))}
      </div>
    );
  };

  const getPositionById = (id: string): { x: string; y: string } => {
    const position = nodes.find((node) => node.id === id);
    if (position) {
      const mapWidth = 5000;
      const mapHeight = 3400;
      return {
        x: `${(parseInt(position.xcoord, 10) / mapWidth) * mapWidth}`,
        y: `${(parseInt(position.ycoord, 10) / mapHeight) * mapHeight}`,
      };
    }
    return { x: "0", y: "0" };
  };

  return (
    <div className={styles.container}>
      {selectedNodeDetails && <NodeDetailsPopup node={selectedNodeDetails} />}

      <div className={styles.mapContainer}>
        <FloorSwitcher />

          <TransformWrapper
              doubleClick={{
                  disabled: true,
              }}
          >
              <div className={styles.checkboxContainer}>
                  <FormControlLabel
                      control={
                          <Checkbox
                              checked={showEdges}
                              onChange={(e) => setShowEdges(e.target.checked)}
                          />
                      }
                      label={
                          <Typography
                              className={styles.checkboxLabel}
                              onClick={(e) => e.stopPropagation()}
                          >
                              Edges
                          </Typography>
                      }
                  />
                  <FormControlLabel
                      control={
                          <Checkbox
                              checked={showNodes}
                              onChange={(e) => setShowNodes(e.target.checked)}
                          />
                      }
                      label={
                          <Typography
                              className={styles.checkboxLabel}
                              onClick={(e) => e.stopPropagation()}
                          >
                              Nodes
                          </Typography>
                      }
                  />
              </div>
              <TransformComponent>
                  <div className={styles.mapAndDots}>
                      <img
                          src={floorMaps[currentFloor as keyof typeof floorMaps]}
                          alt={`Floor ${currentFloor}`}
                          className={styles.mapImage}
                      />
                      <svg className={styles.overlay} viewBox="0 0 5000 3400">
                          {showEdges &&
                              edges.map((edge) => {
                                  const startNode = nodes.find(
                                      (node) => node.id === edge.startNode,
                                  );
                                  const endNode = nodes.find(
                                      (node) => node.id === edge.endNode,
                                  );
                                  if (
                                      startNode &&
                                      endNode &&
                                      startNode.floor === currentFloor &&
                                      endNode.floor === currentFloor
                                  ) {
                                      const startPosition = getPositionById(startNode.id);
                                      const endPosition = getPositionById(endNode.id);
                                      return (
                                          <line
                                              key={`${edge.startNode}-${edge.endNode}`}
                                              x1={startPosition.x}
                                              y1={startPosition.y}
                                              x2={endPosition.x}
                                              y2={endPosition.y}
                                              stroke="blue"
                                              strokeWidth="5"
                                          />
                                      );
                                  }
                                  return null;
                              })}
                          {showNodes &&
                              nodes
                                  .filter((node) => node.floor === currentFloor)
                                  .map((node) => {
                                      const position = getPositionById(node.id);
                                      const isSelected = node === selectedNodeDetails;
                                      return (
                                          <circle
                                              key={node.id}
                                              cx={position.x}
                                              cy={position.y}
                                              r="9"
                                              fill="red"
                                              stroke={isSelected ? "black" : "none"}
                                              strokeWidth={isSelected ? "3" : "0"}
                                              onClick={() => handleNodeClick(node.id)}
                                              style={{cursor: "pointer"}} // Makes it clear the node is clickable
                                          />
                                      );
                                  })}
                      </svg>
                  </div>
              </TransformComponent>
          </TransformWrapper>
      </div>
    </div>
  );
};

export default StaticFloorMapDebug;
