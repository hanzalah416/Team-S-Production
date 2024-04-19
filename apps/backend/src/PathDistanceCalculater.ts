import { getFloorNum, GraphNode } from "./makegraph.ts";

//Calculates the euclidean distance between 2 nodes into feet
export function CalculatePathDistance(node1: GraphNode, node2: GraphNode) {
  //If there on the same floor
  if (node1.floor == node2.floor) {
    //Calculate euclidean distance
    const distance = Math.sqrt(
      Math.pow(node2.xcoord - node1.xcoord, 2) +
        Math.pow(node2.ycoord - node1.ycoord, 2),
    );

    //Convert to feet(1 foot = 3 xy)
    return distance / 3;
  } else if (node1.nodeType == "ELEV") {
    return 0.5;
  } else {
    const floorDif = Math.abs(
      getFloorNum(node2.floor) - getFloorNum(node1.floor),
    );

    return floorDif * 10;
  }
}

export function CalculateTotalPathDist(path: GraphNode[]) {
  let totalDist: number = 0;

  for (let i = 0; i < path.length - 1; i++) {
    totalDist += CalculatePathDistance(path[i], path[i + 2]);
  }

  return totalDist;
}
