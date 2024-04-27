import axios from "axios";
interface NodeId {
  nodeID: string;
}

export default async function GetElevatorIds() {
  try {
    const response = await axios.get<NodeId[]>("/api/elevatorNodes");
    const elevIds = response.data.map((elevator) => elevator.nodeID.toString());

    //console.log(elevIds);

    return elevIds; // Return if needed
  } catch (error) {
    console.error("Error fetching elevator id's data:", error);
    throw error; // Throw error for handling elsewhere
  }
}
