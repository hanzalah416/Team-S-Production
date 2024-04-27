//Imports
import ATMIcon from "../assets/MapKeyIcons/ATMIcon.png";
import BusStopIcon from "../assets/MapKeyIcons/BusStopIcon.png";
import CafeIcon from "../assets/MapKeyIcons/CafeIcon.png";
import DiningIcon from "../assets/MapKeyIcons/DiningIcon.png";
import ElevatorIcon from "../assets/MapKeyIcons/ElevatorIcon.png";
import EmergencyIcon from "../assets/MapKeyIcons/EmergencyIcon.png";
import EntranceIcon from "../assets/MapKeyIcons/EntranceIcon.png";
import EscalatorIcon from "../assets/MapKeyIcons/EscalatorIcon.png";
import HandicapIcon from "../assets/MapKeyIcons/HandicapIcon.png";
import ParkingIcon from "../assets/MapKeyIcons/ParkingIcon.png";
import RestroomIcon from "../assets/MapKeyIcons/RestroomIcon.png";
import ValetIcon from "../assets/MapKeyIcons/ValetIcon.png";
import VendingIcon from "../assets/MapKeyIcons/VendingIcon.png";
import WaitingIcon from "../assets/MapKeyIcons/WaitingIcon.png";
import styles from "./FloorMap.module.css";
import { useCallback } from "react";
import { Position } from "../common/PositionInterface.ts";
import { GetClosestNode } from "../HelperFunctions/GetClosestNode.ts";

interface floorMapFunctions {
  handleSelection: (value: Position | null, type: "start" | "end") => void;
  getPositionById: (id: string) => Position;
  startNode: string | undefined;
  showMapKey: boolean;
}

const KeySelection: React.FC<floorMapFunctions> = ({
  startNode,
  showMapKey,
  handleSelection,
  getPositionById,
}) => {
  const algo = "astar";
  const fetchData = useCallback(
    async (currentEndNodes: string[]) => {
      if (!startNode || currentEndNodes.length === 0) {
        console.log("No start node or end nodes specified.");
        return; // Exit if no startNode or end nodes specified
      }
      try {
        const response = await fetch("/api/returnClosest", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            startNode: startNode,
            endNodes: currentEndNodes,
            algorithm: algo,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = String(await response.json());
        console.log(data);
        const position = getPositionById(data);
        handleSelection(position, "end");
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    },
    [startNode, algo, getPositionById, handleSelection],
  );

  //Function to handle clicks
  function HandleClick(type: string) {
    GetClosestNode(type).then((returnedList) => {
      fetchData(returnedList);
    });
  }

  return (
    <div className={`${styles.MapKey} ${showMapKey ? styles.ShowMapKey : ""}`}>
      <button
        type="button"
        className={styles.keyButton}
        onClick={() => HandleClick("atm")}
      >
        <img src={ATMIcon} alt="ATM icon" className={styles.MapKeyIcon} />
      </button>
      <button
        type="button"
        className={styles.keyButtonText}
        onClick={() => HandleClick("atm")}
      >
        <div className={styles.MapKeyItem}>ATM</div>
      </button>

      <button
        type="button"
        className={styles.keyButton}
        onClick={() => HandleClick("busstop")}
      >
        <img
          src={BusStopIcon}
          alt="Bus Stop icon"
          className={styles.MapKeyIcon}
        />
      </button>
      <button
        type="button"
        className={styles.keyButtonText}
        onClick={() => HandleClick("busstop")}
      >
        <div className={styles.MapKeyItem}>Bus Stop</div>
      </button>

      <button
        type="button"
        className={styles.keyButton}
        onClick={() => HandleClick("cafe")}
      >
        <img src={CafeIcon} alt="Cafe icon" className={styles.MapKeyIcon} />
      </button>
      <button
        type="button"
        className={styles.keyButtonText}
        onClick={() => HandleClick("cafe")}
      >
        <div className={styles.MapKeyItem}>Cafe</div>
      </button>

      <button
        type="button"
        className={styles.keyButton}
        onClick={() => HandleClick("cafe")}
      >
        <img src={DiningIcon} alt="Dining icon" className={styles.MapKeyIcon} />
      </button>
      <button
        type="button"
        className={styles.keyButtonText}
        onClick={() => HandleClick("cafe")}
      >
        <div className={styles.MapKeyItem}>Food Service</div>
      </button>

      <button
        type="button"
        className={styles.keyButton}
        onClick={() => HandleClick("elevator")}
      >
        <img
          src={ElevatorIcon}
          alt="Elevator icon"
          className={styles.MapKeyIcon}
        />
      </button>
      <button
        type="button"
        className={styles.keyButtonText}
        onClick={() => HandleClick("elevator")}
      >
        <div className={styles.MapKeyItem}>Elevator</div>
      </button>

      <button
        type="button"
        className={styles.keyButton}
        onClick={() => HandleClick("emergency")}
      >
        <img
          src={EmergencyIcon}
          alt="Emergency icon"
          className={styles.MapKeyIcon}
        />
      </button>
      <button
        type="button"
        className={styles.keyButtonText}
        onClick={() => HandleClick("emergency")}
      >
        <div className={styles.MapKeyItem}>Emergency</div>
      </button>

      <button
        type="button"
        className={styles.keyButton}
        onClick={() => HandleClick("entrance")}
      >
        <img
          src={EntranceIcon}
          alt="Entrance icon"
          className={styles.MapKeyIcon}
        />
      </button>
      <button
        type="button"
        className={styles.keyButtonText}
        onClick={() => HandleClick("entrance")}
      >
        <div className={styles.MapKeyItem}>Entrance</div>
      </button>

      <button
        type="button"
        className={styles.keyButton}
        onClick={() => HandleClick("escalator")}
      >
        <img
          src={EscalatorIcon}
          alt="Escalator icon"
          className={styles.MapKeyIcon}
        />
      </button>
      <button
        type="button"
        className={styles.keyButtonText}
        onClick={() => HandleClick("escalator")}
      >
        <div className={styles.MapKeyItem}>Escalator</div>
      </button>

      <button
        type="button"
        className={styles.keyButton}
        onClick={() => HandleClick("handicapped")}
      >
        <img
          src={HandicapIcon}
          alt="Handicapped entrance icon"
          className={styles.MapKeyIcon}
        />
      </button>
      <button
        type="button"
        className={styles.keyButtonText}
        onClick={() => HandleClick("handicapped")}
      >
        <div className={styles.MapKeyItem}>Handicapped Entrance</div>
      </button>

      <button
        type="button"
        className={styles.keyButton}
        onClick={() => HandleClick("parking")}
      >
        <img
          src={ParkingIcon}
          alt="Parking icon"
          className={styles.MapKeyIcon}
        />
      </button>
      <button
        type="button"
        className={styles.keyButtonText}
        onClick={() => HandleClick("parking")}
      >
        <div className={styles.MapKeyItem}>Parking</div>
      </button>

      <button
        type="button"
        className={styles.keyButton}
        onClick={() => HandleClick("restroom")}
      >
        <img
          src={RestroomIcon}
          alt="Restroom icon"
          className={styles.MapKeyIcon}
        />
      </button>
      <button
        type="button"
        className={styles.keyButtonText}
        onClick={() => HandleClick("restroom")}
      >
        <div className={styles.MapKeyItem}>Restroom</div>
      </button>

      <button
        type="button"
        className={styles.keyButton}
        onClick={() => HandleClick("valet")}
      >
        <img src={ValetIcon} alt="Valet icon" className={styles.MapKeyIcon} />
      </button>
      <button
        type="button"
        className={styles.keyButtonText}
        onClick={() => HandleClick("valet")}
      >
        <div className={styles.MapKeyItem}>Valet</div>
      </button>

      <button
        type="button"
        className={styles.keyButton}
        onClick={() => HandleClick("vending")}
      >
        <img
          src={VendingIcon}
          alt="Vending icon"
          className={styles.MapKeyIcon}
        />
      </button>
      <button
        type="button"
        className={styles.keyButtonText}
        onClick={() => HandleClick("vending")}
      >
        <div className={styles.MapKeyItem}>Vending</div>
      </button>

      <button
        type="button"
        className={styles.keyButton}
        onClick={() => HandleClick("waitingroom")}
      >
        <img
          src={WaitingIcon}
          alt="Waiting room icon"
          className={styles.MapKeyIcon}
        />
      </button>
      <button
        type="button"
        className={styles.keyButtonText}
        onClick={() => HandleClick("waitingroom")}
      >
        <div className={styles.MapKeyItem}>Waiting Room</div>
      </button>
    </div>
  );
};

export default KeySelection;
