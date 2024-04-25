import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useReducer,
} from "react";
import styles from "./FloorMapDebug.module.css";
import {
  Button,
  FormControlLabel,
  Checkbox,
  Typography,
  MenuItem,
  Select,
} from "@mui/material";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import axios from "axios";
import { NodeEdge } from "database";

// Importing map images
import l1Map from "../assets/HospitalMap/00_thelowerlevel1.png";
import l2Map from "../assets/HospitalMap/00_thelowerlevel2.png";
import f1Map from "../assets/HospitalMap/01_thefirstfloor.png";
import f2Map from "../assets/HospitalMap/02_thesecondfloor.png";
import f3Map from "../assets/HospitalMap/03_thethirdfloor.png";
import { SelectChangeEvent } from "@mui/material/Select";
// import fs from "fs";
// import readCSVFile from "../../../../backend/src/Readcsv.ts";

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
  edgeID: string;
  startNode: string;
  endNode: string;
}

interface NodeDetailsPopupProps {
  node: Node | null;
  onSave: (node: Node) => void;
  fetchNodes: () => void; // Add this line
}

interface EdgeDetailsPopupProps {
  edge: NodeEdge | null;
  onSave: (edge: NodeEdge) => void;
  fetchEdges: () => void; // Add this line
}

const StaticFloorMapDebug = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [currentFloor, setCurrentFloor] = useState("1");
  const [showNodes, setShowNodes] = useState(true);
  const [showEdges, setShowEdges] = useState(true);
  // const [selectedStartNodeID, setSelectedNodeID] = useState<string>(""); // State for selected node ID

  const [selectedNodeDetails, setSelectedNodeDetails] = useState<Node | null>(
    null,
  );
  const [newNodeDetails, setNewNodeDetails] = useState<Node | null>(null);
  const [selectedEdgeDetails, setSelectedEdgeDetails] =
    useState<NodeEdge | null>(null);
  const [newEdgeDetails, setNewEdgeDetails] = useState<NodeEdge | null>(null);
  const [dragging, setDragging] = useState<boolean>(false);
  const [draggedNode, setDraggedNode] = useState<Node | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const emptyNode: Node = {
    xcoord: "",
    ycoord: "",
    id: "",
    longName: "",
    floor: "",
    building: "",
    nodeType: "",
    shortName: "",
  };

  const emptyEdge: NodeEdge = {
    edgeID: "",
    startNode: "",
    endNode: "",
  };

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

  const handleUpdateEdge = (updatedEdge: NodeEdge) => {
    setEdges((prevEdges) =>
      prevEdges.map((edge) =>
        edge.edgeID === updatedEdge.edgeID ? updatedEdge : edge,
      ),
    );
  };

  const handleAddNode = (newNode: Node) => {
    nodes.push(newNode);
  };

  const handleAddEdge = (newEdge: NodeEdge) => {
    edges.push(newEdge);
  };

  // const fetchNodes = async () => {
  //   try {
  //     const response = await axios.get("/api/nodes");
  //
  //       console.log("Fetched nodes:", response.data);
  //     setNodes(response.data);
  //   } catch (error) {
  //     console.error("Failed to fetch nodes:", error);
  //   }
  // };
  //
  // const fetchEdges = async () => {
  //   try {
  //     const response = await axios.get("/api/edges");
  //     setEdges(response.data);
  //   } catch (error) {
  //     console.error("Failed to fetch edges:", error);
  //   }
  // };

  useEffect(() => {
    fetchNodes();
    console.log("nodes");
    fetchEdges();
    console.log("edges"); // Call this function on component mount to load nodes initially
  }, []);

  const handleNodeClick = (nodeId: string) => {
    const node = nodes.find((node) => node.id === nodeId);
    if (!node) {
      return;
    }

    setSelectedNodeDetails(node);
  };

  const handleEdgeClick = (startnode: string, endNode: string) => {
    const edge = edges.find(
      (edge) => startnode === edge.startNode && endNode === edge.endNode,
    );
    if (!edge) {
      return;
    }
    setSelectedEdgeDetails(edge);
  };

  const NodeDetailsPopup: React.FC<NodeDetailsPopupProps> = ({
    node,
    onSave,
  }) => {
    const popupRef = useRef<HTMLDivElement>(null);

    const [editableNode, setEditableNode] = useState<Node>({
      ...emptyNode,
      ...node,
    });

    const handleClose = useCallback(() => {
      setSelectedNodeDetails(null);
      setNewNodeDetails(null);
      fetchNodes();
    }, []);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      console.log("inputchangefirst");
      const { name, value } = event.target;
      setEditableNode((prev) => ({ ...prev, [name]: value }));
    };

    const handleInputChangeFloor = (event: SelectChangeEvent<string>) => {
      console.log("inputchangefloor");
      const { name, value } = event.target;
      setEditableNode((prev) => ({ ...prev, [name]: value }));
    };

    const handleInputChangeID = (
      event: React.ChangeEvent<HTMLInputElement>,
    ) => {
      const { name, value } = event.target;
      if (selectedNodeDetails) return;
      setEditableNode((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
      if (selectedNodeDetails) {
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
      }

      if (newNodeDetails) {
        const url = `/api/nodes`;
        try {
          const response = await axios.post(url, {
            nodeID: editableNode.id,
            xcoord: Number(editableNode.xcoord),
            ycoord: Number(editableNode.ycoord),
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
          console.error("Error adding node:", error);
        }
      }
    };

    const handleDeleteNode = async () => {
      if (!node) return;
      const url = `/api/nodes/${node.id}`;
      // console.log(url);
      await axios
        .delete(url)
        .then(() => {
          // console.log(`Deleted node from url ${url}. response: ${response}`);
        })
        .catch((error) => {
          console.error(error);
        });
      handleClose(); // Close the popup
      await fetchNodes(); // Fetch all nodes again to reflect the update
    };

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
                    onChange={handleInputChangeID}
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
                  <Select
                    value={editableNode.floor}
                    name="floor"
                    onChange={handleInputChangeFloor} // Use onChange to handle changes
                    className={styles.dropdown} // You can adjust the className if needed
                    inputProps={{ "aria-label": "Select Floor" }} // ARIA label for accessibility
                  >
                    {["L2", "L1", "1", "2", "3"].map((floorNumber) => (
                      <MenuItem key={floorNumber} value={floorNumber}>
                        {floorNumber}
                      </MenuItem>
                    ))}
                  </Select>
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
            {!newNodeDetails && (
              <button
                id="delete"
                onClick={handleDeleteNode}
                className={styles.redCustomButton}
              >
                Delete Node
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const EdgeDetailsPopup: React.FC<EdgeDetailsPopupProps> = ({
    edge,
    onSave,
  }) => {
    const popupRef = useRef<HTMLDivElement>(null);
    const defaultEdge: NodeEdge = {
      edgeID: "",
      startNode: "",
      endNode: "",
    };

    const [editableEdge, setEditableEdge] = useState<NodeEdge>({
      ...defaultEdge,
      ...edge,
    });

    const handleClose = useCallback(() => {
      setSelectedEdgeDetails(null);
      setNewEdgeDetails(null);
    }, []);

    const handleInputChange = (event: SelectChangeEvent<string>) => {
      const { name, value } = event.target;
      console.log("inputchange");
      setEditableEdge({ ...editableEdge, [name]: value });
      console.log(editableEdge);
    };

    const handleSave = async () => {
      const url = `/api/edges`;
      console.log(url);
      try {
        const response = await axios.post(url, {
          edgeID: editableEdge.startNode + "_" + editableEdge.endNode,
          startNode: editableEdge.startNode,
          endNode: editableEdge.endNode,
        });
        console.log(response);
        onSave(response.data); // Update local state with the response
        await fetchEdges(); // Fetch all nodes again to reflect the update
      } catch (error) {
        console.error("Error updating edge details:", error);
        alert("Edge edit failed: try again");
        return;
      }

      if (!edge) return;
      if (selectedEdgeDetails) {
        const del = url + "/" + edge.startNode + "_" + edge.endNode;
        console.log(del);
        try {
          await axios.delete(del);
          handleClose(); // Close the popup
          await fetchEdges(); // Fetch all nodes again to reflect the update
        } catch (error) {
          console.error("Error deleting old edge", error);
        }
      }
    };

    const handleDeleteEdge = async () => {
      if (!edge) return;
      const url = `/api/edges/${edge.startNode + "_" + edge.endNode}`;
      await axios.delete(url).catch((error) => {
        console.error(error);
      });
      handleClose(); // Close the popup
      fetchEdges(); // Fetch all nodes again to reflect the update
    };

    // const handleClickOutside = useCallback(
    //   (event: MouseEvent) => {
    //     if (
    //       popupRef.current &&
    //       event.target instanceof Node &&
    //       !popupRef.current.contains(event.target)
    //     ) {
    //       handleClose();
    //     }
    //   },
    //   [handleClose],
    // );
    //
    // useEffect(() => {
    //   document.addEventListener("mousedown", handleClickOutside);
    //   return () => {
    //     document.removeEventListener("mousedown", handleClickOutside);
    //   };
    // }, [handleClickOutside]);

    if (!editableEdge) return null;

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
                <td className={styles.label}>Start Node:</td>
                <td>
                  <Select
                    name="startNode"
                    value={editableEdge.startNode}
                    onChange={handleInputChange}
                    className={styles.dropdown}
                    inputProps={{ "aria-label": "Select Node ID" }}
                  >
                    <MenuItem value="" disabled>
                      Select Node ID
                    </MenuItem>
                    {nodes.map((node) => (
                      <MenuItem key={node.id} value={node.id}>
                        {node.id}
                      </MenuItem>
                    ))}
                  </Select>
                </td>
              </tr>
              <tr>
                <td className={styles.label}>End Node:</td>
                <td>
                  <Select
                    name="endNode"
                    value={editableEdge.endNode}
                    onChange={handleInputChange}
                    className={styles.dropdown}
                    inputProps={{ "aria-label": "Select Node ID" }}
                  >
                    <MenuItem value="" disabled>
                      Select Node ID
                    </MenuItem>
                    {nodes.map((node) => (
                      <MenuItem key={node.id} value={node.id}>
                        {node.id}
                      </MenuItem>
                    ))}
                  </Select>
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
            {!newEdgeDetails && (
              <button
                id="delete"
                onClick={handleDeleteEdge}
                className={styles.customButton}
              >
                Delete Edge
              </button>
            )}
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
    const floorOrder = ["L2", "L1", "1", "2", "3"];
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

  const deleteNodesAndEdges = async () => {
    try {
      const deletePromises = nodes.map((element) =>
        axios.delete(`/api/nodes/${element.id}`),
      );
      await Promise.all(deletePromises);
      console.log("All nodes deleted successfully.");
    } catch (error) {
      console.error("Failed to delete nodes:", error);
    }
  };
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const resetNodesAndEdgesReal = async () => {
    console.log("Deleting nodes and edges...");
    await deleteNodesAndEdges();
    forceUpdate();
    console.log("Sending reset command to the server...");

    const resetResponse = await axios.post(
      `/api/reset-nodes`,
      {},
      { timeout: 5000 },
    ); // 5 seconds timeout
    console.log("Server responded to reset:", resetResponse.data);

    await fetchNodes();
    await fetchEdges();
    console.log("Nodes and edges fetched after reset.");
  };

  const resetNodesAndEdges = async () => {
    console.log("Starting reset process...");
    setIsLoading(true); // Start loading
    try {
      await resetNodesAndEdgesReal();
      console.log("Reset process completed, fetching nodes and edges...");
      await fetchNodes();
      await fetchEdges();
      console.log("Nodes and edges fetched after reset.");
    } catch (error) {
      console.error("Error during the reset process:", error);
    }
    setIsLoading(false); // Stop loading
  };
  const LoadingOverlay = () => (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw", // Cover the full viewport width
        height: "100vh", // Cover the full viewport height
        backgroundColor: "rgba(0,0,0,0.5)", // Semi-transparent background
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000, // Ensure it covers other UI elements
      }}
    >
      <div
        style={{
          width: "300px", // Fixed width for the inner box
          height: "100px", // Fixed height for the inner box
          backgroundColor: "rgba(0,0,0,0.75)", // Darker background for the box
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "10px", // Rounded corners for the box
        }}
      >
        <Typography variant="h6" style={{ color: "white" }}>
          Resetting Data...
        </Typography>
      </div>
    </div>
  );

  // Ensure fetchNodes and fetchEdges are correctly implemented
  const fetchNodes = async () => {
    try {
      const response = await axios.get("/api/nodes");
      console.log("Nodes fetched successfully:", response.data);
      setNodes(response.data);
    } catch (error) {
      console.error("Failed to fetch nodes:", error);
    }
  };

  const fetchEdges = async () => {
    try {
      const response = await axios.get("/api/edges");
      console.log("Edges fetched successfully:", response.data);
      setEdges(response.data);
    } catch (error) {
      console.error("Failed to fetch edges:", error);
    }
  };
  return (
    <div className={styles.container}>
      {isLoading && <LoadingOverlay />}
      {selectedNodeDetails && (
        <NodeDetailsPopup
          node={selectedNodeDetails}
          onSave={handleUpdateNode}
          fetchNodes={fetchNodes}
        />
      )}

      {newNodeDetails && (
        <NodeDetailsPopup
          node={newNodeDetails}
          onSave={handleAddNode}
          fetchNodes={fetchNodes}
        />
      )}

      {selectedEdgeDetails && (
        <EdgeDetailsPopup
          edge={selectedEdgeDetails}
          onSave={handleUpdateEdge}
          fetchEdges={fetchEdges}
        />
      )}

      {newEdgeDetails && (
        <EdgeDetailsPopup
          edge={newEdgeDetails}
          onSave={handleAddEdge}
          fetchEdges={fetchEdges}
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
                margin: "6px",
              }}
            >
              Import/Export Nodes
            </Button>

            <Button
              variant="contained"
              className={styles.csvButton}
              style={{
                backgroundColor: "#003b9c",
                fontFamily: "Poppins",
                fontSize: 14,
                textAlign: "center",
                margin: "6px",
              }}
              onClick={() => resetNodesAndEdges()}
            >
              Reset Nodes and Edges
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
                  Display Edges
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
                  Display Nodes
                </Typography>
              }
            />

            <Button
              variant="contained"
              className={styles.csvButton}
              style={{
                backgroundColor: "#003b9c",
                fontFamily: "Poppins",
                fontSize: 14,
                textAlign: "center",
                margin: "6px",
              }}
              onClick={() => setNewNodeDetails(emptyNode)}
            >
              Add Node
            </Button>
            <Button
              variant="contained"
              className={styles.csvButton}
              style={{
                backgroundColor: "#003b9c",
                fontFamily: "Poppins",
                fontSize: 14,
                textAlign: "center",
                margin: "6px",
              }}
              onClick={() => setNewEdgeDetails(emptyEdge)}
            >
              Add Edge
            </Button>
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
                          onClick={() =>
                            handleEdgeClick(edge.startNode, edge.endNode)
                          }
                          style={{ cursor: "pointer" }}
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
