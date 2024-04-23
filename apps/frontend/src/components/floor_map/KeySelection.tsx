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
import axios from "axios";
import {useCallback,  useState} from "react";

export interface Position {
  label: string;
  id: string;
  top: string;
  left: string;
  floor: string;
}

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
  const [, setEndNodes] = useState<string[]>([""]);

  const algo = "astar";
    const fetchData = useCallback(async (currentEndNodes: string[]) => {
        if (!startNode || currentEndNodes.length === 0) {
            console.log('No start node or end nodes specified.');
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
    }, [startNode, algo, getPositionById, handleSelection]);


  async function getClosestNode(type: string) {
    let idArray: string[] = [];

    switch (type) {
      case "atm":
        idArray = ["FSERV00101", "FSERV00101"];
        break;
      case "busstop":
        idArray = [
          "DEXIT00102",
          "FEXIT00301",
          "GEXIT001L1",
          "AEXIT001L2",
          "FEXIT00101",
          "FEXIT00201",
          "FEXIT00301",
          "GEXIT00101",
        ];
        break;
      case "cafe":
        idArray = [
          "ARETL00101",
          "ASTAI00101",
          "HRETL00102",
          "DRETL00102",
          "BHALL02602",
            "FRETL00201",
        ];
        break;
      case "elevator":
        idArray = await getElevatorIds();
        break;
      case "emergency":
        idArray = ["FDEPT00501"];
        break;
      case "entrance":
        idArray = [
          "DEXIT00102",
          "FEXIT00301",
          "GEXIT001L1",
          "AEXIT001L2",
          "FEXIT00101",
          "FEXIT00201",
          "FEXIT00301",
          "GEXIT00101",
        ];
        break;
      case "escalator":
        idArray = [
          "FSTAI00301",
          "HSTAI00302",
          "GSTAI01301",
          "GSTAI00501",
          "GSTAI008L1",
          "GSTAI02802",
          "GSTAI02602",
          "GSTAI00903",
        ];
        break;
      case "handicapped":
        idArray = [
          "FEXIT00301",
          "FEXIT00101",
          "FEXIT00201",
          "FEXIT00301",
          "GEXIT00101",
        ];
        break;
      case "parking":
        idArray = ["AEXIT001L2"];
        break;
      case "restroom":
        idArray = [
          "AREST00101",
          "AREST00103",
          "BREST00102",
          "BREST00202",
          "BREST00302",
          "BREST00402",
          "BREST00502",
          "CREST001L1",
          "CREST001L2",
          "CREST002L1",
          "CREST002L2",
          "CREST003L1",
          "CREST004L1",
          "DREST00102",
          "DREST00202",
          "DREST00302",
          "DREST00402",
          "EREST00101",
          "EREST00201",
          "EREST00301",
          "GREST01201",
          "GREST00602",
          "GREST03102",
          "GREST01203",
          "GREST004L2",
          "IREST00103",
          "IREST00203",
          "IREST00303",
          "IREST00403",
          "IREST00503",
          "FREST00101",
          "HBATH00102",
          "HBATH00103",
          "HBATH00203",
        ];
        break;
      case "valet":
        idArray = ["BINFO00202", "FEXIT00201", "FSERV00501"];
        break;
      case "vending":
        idArray = ["CRETL001L1", "FRETL00101", "HRETL00202"];
        break;
      case "waitingroom":
        idArray = [
          "ADEPT00101",
          "ADEPT00201",
          "ADEPT00301",
          "CDEPT002L1",
          "CDEPT003L1",
          "DDEPT00402",
          "EDEPT00101",
          "GDEPT00702",
          "HDEPT00103",
          "HDEPT00203",
        ];
        break;
    }
      setEndNodes(idArray); // This still updates the state for other potential uses.
      fetchData(idArray);

  }



    return (
    <div className={`${styles.MapKey} ${showMapKey ? styles.ShowMapKey : ""}`}>
      <button
        type="button"
        className={styles.keyButton}
        onClick={() => getClosestNode("atm")}

      >
        <img src={ATMIcon} alt="ATM icon" className={styles.MapKeyIcon} />
      </button>
      <button
        type="button"
        className={styles.keyButtonText}
        onClick={() => getClosestNode("atm")}
      >
        <div className={styles.MapKeyItem}>ATM</div>
      </button>

      <button
        type="button"
        className={styles.keyButton}
        onClick={() => getClosestNode("busstop")}
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
        onClick={() => getClosestNode("busstop")}
      >
        <div className={styles.MapKeyItem}>Bus Stop</div>
      </button>

      <button
        type="button"
        className={styles.keyButton}
        onClick={() => getClosestNode("cafe")}
      >
        <img src={CafeIcon} alt="Cafe icon" className={styles.MapKeyIcon} />
      </button>
      <button
        type="button"
        className={styles.keyButtonText}
        onClick={() => getClosestNode("cafe")}
      >
        <div className={styles.MapKeyItem}>Cafe</div>
      </button>

      <button
        type="button"
        className={styles.keyButton}
        onClick={() => getClosestNode("cafe")}
      >
        <img src={DiningIcon} alt="Dining icon" className={styles.MapKeyIcon} />
      </button>
      <button
        type="button"
        className={styles.keyButtonText}
        onClick={() => getClosestNode("cafe")}
      >
        <div className={styles.MapKeyItem}>Food Service</div>
      </button>

      <button
        type="button"
        className={styles.keyButton}
        onClick={() => getClosestNode("elevator")}
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
        onClick={() => getClosestNode("elevator")}
      >
        <div className={styles.MapKeyItem}>Elevator</div>
      </button>

      <button
        type="button"
        className={styles.keyButton}
        onClick={() => getClosestNode("emergency")}
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
        onClick={() => getClosestNode("emergency")}
      >
        <div className={styles.MapKeyItem}>Emergency</div>
      </button>

      <button
        type="button"
        className={styles.keyButton}
        onClick={() => getClosestNode("entrance")}
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
        onClick={() => getClosestNode("entrance")}
      >
        <div className={styles.MapKeyItem}>Entrance</div>
      </button>

      <button
        type="button"
        className={styles.keyButton}
        onClick={() => getClosestNode("escalator")}
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
        onClick={() => getClosestNode("escalator")}
      >
        <div className={styles.MapKeyItem}>Escalator</div>
      </button>

      <button
        type="button"
        className={styles.keyButton}
        onClick={() => getClosestNode("handicapped")}
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
        onClick={() => getClosestNode("handicapped")}
      >
        <div className={styles.MapKeyItem}>Handicapped Entrance</div>
      </button>

      <button
        type="button"
        className={styles.keyButton}
        onClick={() => getClosestNode("parking")}
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
        onClick={() => getClosestNode("parking")}
      >
        <div className={styles.MapKeyItem}>Parking</div>
      </button>

      <button
        type="button"
        className={styles.keyButton}
        onClick={() => getClosestNode("restroom")}
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
        onClick={() => getClosestNode("restroom")}
      >
        <div className={styles.MapKeyItem}>Restroom</div>
      </button>

      <button
        type="button"
        className={styles.keyButton}
        onClick={() => getClosestNode("valet")}
      >
        <img src={ValetIcon} alt="Valet icon" className={styles.MapKeyIcon} />
      </button>
      <button
        type="button"
        className={styles.keyButtonText}
        onClick={() => getClosestNode("valet")}
      >
        <div className={styles.MapKeyItem}>Valet</div>
      </button>

      <button
        type="button"
        className={styles.keyButton}
        onClick={() => getClosestNode("vending")}
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
        onClick={() => getClosestNode("vending")}
      >
        <div className={styles.MapKeyItem}>Vending</div>
      </button>

      <button
        type="button"
        className={styles.keyButton}
        onClick={() => getClosestNode("waitingroom")}
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
        onClick={() => getClosestNode("waitingroom")}
      >
        <div className={styles.MapKeyItem}>Waiting Room</div>
      </button>
    </div>
  );
};


interface NodeId {
  nodeID: string;
}

async function getElevatorIds() {
  try {
    const response = await axios.get<NodeId[]>("/api/elevatorNodes");
    const elevIds = response.data.map((elevator) => elevator.nodeID.toString());

    console.log(elevIds);

    return elevIds; // Return if needed
  } catch (error) {
    console.error("Error fetching elevator id's data:", error);
    throw error; // Throw error for handling elsewhere
  }
}

export default KeySelection;
