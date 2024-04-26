import { Position } from "../common/PositionInterface.ts";
import { GetClosestNode } from "../HelperFunctions/GetClosestNode.ts";

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
  GetClosestNode(type).then((returnedList) => {
    fetchData(startNode, returnedList).then((returnedID) => {
      if (returnedID) {
        handleSelection(getPositionById(returnedID), "end");
      }
    });
  });
}

export default SpeechKey;
