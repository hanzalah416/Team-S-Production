import axios from "axios";
import { Position } from "../common/PositionInterface.ts";

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

const fetchData = async (startNode: string, currentEndNodes: string[]) => {
  if (!startNode || currentEndNodes.length === 0) {
    console.log("No start node or end nodes specified.");
    return "";
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
        algorithm: "astar",
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = String(await response.json());
    console.log(data);
    return data;
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }
};

function SpeechKey(
  startNode: string,
  handleSelection: (value: Position | null, type: "start" | "end") => void,
  getPositionById: (id: string) => Position,
  type: string,
) {
  // Call fetchData with necessary parameters
  getClosestNode(type).then((returnedList) => {
    fetchData(startNode, returnedList).then((returnedID) => {
      if (returnedID) {
        handleSelection(getPositionById(returnedID), "end");
      }
    });
  });
}
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
  // This still updates the state for other potential uses
  return idArray;
}

export default SpeechKey;
