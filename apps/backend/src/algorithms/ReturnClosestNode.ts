//Imports
import MakeGraph from "../makegraph.ts";
import { TotalDistanceGraph } from "../PathDistanceCalculater.ts";

//A function to calculate the closest node to a particular start node from an array of end nodes
export function ReturnClosestNode(
  startNode: string,
  endNodes: string[],
  graph: MakeGraph,
) {
  //const graph = new MakeGraph(algorithm);
  let curShortest = 99999;
  let currentId: string = "";

  //Calculate the total distance to each end node and compare to the current shortest
  endNodes.forEach((node) => {
    //Calculate the path and distance
    const tempPath = graph.findPath(startNode, node);
    const distance = TotalDistanceGraph(tempPath);
    //Compare
    if (distance < curShortest) {
      curShortest = distance;
      currentId = node;
    }
  });

  return currentId;
}
