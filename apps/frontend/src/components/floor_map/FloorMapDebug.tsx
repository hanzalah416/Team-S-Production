import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./FloorMapDebug.module.css";
import { Button, FormControlLabel, Checkbox, Typography } from "@mui/material";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import axios from "axios";

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
  nodeType: string;
  building: string;
  shortName: string;
}

interface Edge {
  startNode: string;
  endNode: string;
}

interface NodeDetailsPopupProps {
  node: Node | null;
  onSave: (node: Node) => void;
  fetchNodes: () => void; // Add this line
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
  const [dragging, setDragging] = useState<boolean>(false);
  const [draggedNode, setDraggedNode] = useState<Node | null>(null);

  const updateNodePosition = (id: string, newX: number, newY: number) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === id
          ? {
              ...node,
              xcoord: Math.round(newX).toString(),
              ycoord: Math.round(newY).toString(),
            }
          : node,
      ),
    );
  };

  const handleMouseDown = (
    node: Node,
    event: React.MouseEvent<SVGCircleElement, MouseEvent>,
  ) => {
    setDragging(true);
    setDraggedNode(node);
    event.stopPropagation();
  };

  const handleMouseMove = (
    event: React.MouseEvent<SVGSVGElement, MouseEvent>,
  ) => {
    if (!dragging || !draggedNode) return;

    const svgElement = event.currentTarget as SVGSVGElement;
    const pt = svgElement.createSVGPoint();
    pt.x = event.clientX;
    pt.y = event.clientY;

    const screenCTM = svgElement.getScreenCTM();
    if (!screenCTM) {
      console.error("Failed to get the screen CTM.");
      return; // If screenCTM is null, log an error and exit the function early.
    }

    const transformedPt = pt.matrixTransform(screenCTM.inverse());
    updateNodePosition(draggedNode.id, transformedPt.x, transformedPt.y);
  };

  const handleMouseUp = () => {
    if (!dragging) return;
    setDragging(false);
    setDraggedNode(null);
    // Optional: persist the node position change to a backend here
  };

  const handleUpdateNode = (updatedNode: Node) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === updatedNode.id ? updatedNode : node,
      ),
    );
  };

  const fetchNodes = async () => {
    try {
      const response = await axios.get("/api/nodes");
      setNodes(response.data);
    } catch (error) {
      console.error("Failed to fetch nodes:", error);
    }
  };

  useEffect(() => {
    fetchNodes(); // Call this function on component mount to load nodes initially
  }, []);

  const handleNodeClick = (nodeId: string) => {
    const node = nodes.find((node) => node.id === nodeId);
    if (node !== undefined) {
      setSelectedNodeDetails(node);
    } else {
      setSelectedNodeDetails(null); // Explicitly set to null if no node is found
    }
  };

  const NodeDetailsPopup: React.FC<NodeDetailsPopupProps> = ({
    node,
    onSave,
  }) => {
    const popupRef = useRef<HTMLDivElement>(null);
    const defaultNode: Node = {
      xcoord: "",
      ycoord: "",
      id: "",
      longName: "",
      floor: "",
      building: "",
      nodeType: "",
      shortName: "",
    };

    const [editableNode, setEditableNode] = useState<Node>({
      ...defaultNode,
      ...node,
    });

    const handleClose = useCallback(() => {
      setSelectedNodeDetails(null);
      fetchNodes();
    }, []);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      setEditableNode((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
      const url = `/api/nodes/${editableNode.id}`;
      try {
        const response = await axios.patch(url, {
          xcoord: editableNode.xcoord,
          ycoord: editableNode.ycoord,
          floor: editableNode.floor,
          longName: editableNode.longName,
          nodeType: editableNode.nodeType,
          building: editableNode.building,
          shortName: editableNode.shortName,
        });

        onSave(response.data); // Update local state with the response
        handleClose(); // Close the popup
        await fetchNodes(); // Fetch all nodes again to reflect the update
      } catch (error) {
        console.error("Error updating node details:", error);
      }
    };

    const handleClickOutside = useCallback(
      (event: MouseEvent) => {
        if (
          popupRef.current &&
          event.target instanceof Node &&
          !popupRef.current.contains(event.target)
        ) {
          handleClose();
        }
      },
      [handleClose],
    );

    useEffect(() => {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [handleClickOutside]);

    if (!editableNode) return null;

    return (
      <div className={styles.nodeDetailsPopupContainer} onClick={handleClose}>
        <div
          className={styles.nodeDetailsPopup}
          ref={popupRef}
          onClick={(e) => e.stopPropagation()}
        >
          <table className={styles.detailsTable}>
            <tbody>
              <tr>
                <td className={styles.label}>ID:</td>
                <td>
                  <input
                    type="text"
                    name="id"
                    value={editableNode.id}
                    onChange={handleInputChange}
                    className={styles.inputField}
                  />
                </td>
              </tr>
              <tr>
                <td className={styles.label}>Name:</td>
                <td>
                  <input
                    type="text"
                    name="longName"
                    value={editableNode.longName}
                    onChange={handleInputChange}
                    className={styles.inputField}
                  />
                </td>
              </tr>
              <tr>
                <td className={styles.label}>Floor:</td>
                <td>
                  <input
                    type="text"
                    name="floor"
                    value={editableNode.floor}
                    onChange={handleInputChange}
                    className={styles.inputField}
                  />
                </td>
              </tr>
              <tr>
                <td className={styles.label}>X Coordinate:</td>
                <td>
                  <input
                    type="text"
                    name="xcoord"
                    value={editableNode.xcoord}
                    onChange={handleInputChange}
                    className={styles.inputField}
                  />
                </td>
              </tr>
              <tr>
                <td className={styles.label}>Y Coordinate:</td>
                <td>
                  <input
                    type="text"
                    name="ycoord"
                    value={editableNode.ycoord}
                    onChange={handleInputChange}
                    className={styles.inputField}
                  />
                </td>
              </tr>
              <tr>
                <td className={styles.label}>Node Type:</td>
                <td>
                  <input
                    type="text"
                    name="nodeType"
                    value={editableNode.nodeType}
                    onChange={handleInputChange}
                    className={styles.inputField}
                  />
                </td>
              </tr>
              <tr>
                <td className={styles.label}>Building:</td>
                <td>
                  <input
                    type="text"
                    name="building"
                    value={editableNode.building}
                    onChange={handleInputChange}
                    className={styles.inputField}
                  />
                </td>
              </tr>

              <tr>
                <td className={styles.label}>Short Name:</td>
                <td>
                  <input
                    type="text"
                    name="shortName"
                    value={editableNode.shortName}
                    onChange={handleInputChange}
                    className={styles.inputField}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <div className={styles.buttonGroup}>
            <button onClick={handleSave} className={styles.customButton}>
              Save
            </button>
            <button onClick={handleClose} className={styles.customButton}>
              Close
            </button>
          </div>
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
      {selectedNodeDetails && (
        <NodeDetailsPopup
          node={selectedNodeDetails}
          onSave={handleUpdateNode}
          fetchNodes={fetchNodes}
        />
      )}

      <div className={styles.mapContainer}>
        <FloorSwitcher />

        <TransformWrapper
          doubleClick={{
            disabled: true,
          }}
        >
          <div className={styles.checkboxContainer}>
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
              <svg
                className={styles.overlay}
                viewBox="0 0 5000 3400"
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
              >
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
                          onMouseDown={(e) => handleMouseDown(node, e)}
                          style={{ cursor: "pointer" }} // Makes it clear the node is clickable
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
