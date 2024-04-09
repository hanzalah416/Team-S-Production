import React, { useState, useEffect } from "react";
import styles from "./FloorMapDebug.module.css";
import { Button } from "@mui/material";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import l1Map from "../assets/HospitalMap/00_thelowerlevel1.png";
import l2Map from "../assets/HospitalMap/00_thelowerlevel2.png";
import f1Map from "../assets/HospitalMap/01_thefirstfloor.png";
import f2Map from "../assets/HospitalMap/02_thesecondfloor.png";
import f3Map from "../assets/HospitalMap/03_thethirdfloor.png";

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

const StaticFloorMapDebug = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [currentFloor, setCurrentFloor] = useState("1");

  useEffect(() => {
    fetch("/api/nodes")
      .then((response) => response.json())
      .then(setNodes)
      .catch((error) => console.error("Failed to fetch nodes:", error));

    fetch("/api/edges")
      .then((response) => response.json())
      .then(setEdges)
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
      <div className={styles.mapContainer}>
        <FloorSwitcher />
        <TransformWrapper>
          <TransformComponent>
            <div className={styles.mapAndDots}>
              <img
                src={floorMaps[currentFloor]}
                alt={`Floor ${currentFloor}`}
                className={styles.mapImage}
              />
              <svg className={styles.overlay} viewBox="0 0 5000 3400">
                {nodes
                  .filter((node) => node.floor === currentFloor)
                  .map((node) => {
                    const position = getPositionById(node.id);
                    return (
                      <circle
                        key={node.id}
                        cx={position.x}
                        cy={position.y}
                        r="12"
                        fill="red"
                      />
                    );
                  })}
                {edges.map((edge) => {
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
                        strokeWidth="8"
                      />
                    );
                  }
                  return null;
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
