import MakeGraph from "../makegraph.ts";
import { GraphNode, NBMap, Pathfinding } from "../makegraph.ts";

export class DijkstraAlgo implements Pathfinding {
  public findPath(graph: MakeGraph, start: string, end: string) {
    //Get start and end nodes from map
    const startNode = graph.nodeMap.get(start);
    const endNode = graph.nodeMap.get(end);

    //Ensure that the start and end nodes are not identical
    if (!startNode || !endNode) {
      console.error("nodes not found.");
      return [];
    }

    const arrivedFrom: NBMap = new Map(); //Map that contains the node to node parent relationship
    const queue: GraphNode[] = [startNode]; //Queue of open nodes
    arrivedFrom.set(startNode, startNode); //Add arrived from for the start node
    const closedList: GraphNode[] = []; // List of closed

    //Map of different costs
    const gCost: Map<GraphNode, number> = new Map();
    const hCost: Map<GraphNode, number> = new Map();
    const fCost: Map<GraphNode, number> = new Map();

    //Set start node costs
    gCost.set(startNode, 0);
    hCost.set(startNode, 0);
    fCost.set(startNode, 0);

    //Set end node costs
    gCost.set(endNode, 0);
    hCost.set(endNode, 0);
    fCost.set(endNode, 0);

    let pathFound = false;

    while (queue.length > 0) {
      // Sort the queue based on the total estimated cost from start to end via each node
      queue.sort((a, b) => {
        return fCost.get(a)! - fCost.get(b)!;
      });

      //Make the current node the top of the queue (node with the lowest cost)
      const currentNode = queue.shift()!;
      closedList.push(currentNode);

      //If the current node is equal to the end node break the loop and begin tracing the path
      if (currentNode === endNode) {
        pathFound = true;
        break;
      }

      //Add available neighbors of the node to the queue
      currentNode.neighbors.forEach((neighbor) => {
        //See if node has already been added
        if (!closedList.includes(neighbor)) {
          if (!arrivedFrom.has(neighbor)) {
            arrivedFrom.set(neighbor, currentNode);
          }

          //Calculate the g,h, and f cost for the nodes and add them to the map
          const gCostNeighbor =
            gCost.get(currentNode)! +
            graph.getEucDistance(neighbor, currentNode);
          const hCostNeighbor = graph.getEucDistance(neighbor, endNode);
          const fCostNeighbor = gCostNeighbor + hCostNeighbor;

          //Set the costs for neighbors
          gCost.set(neighbor, gCostNeighbor);
          hCost.set(neighbor, hCostNeighbor);
          fCost.set(neighbor, fCostNeighbor);

          //Check if node is already in the open queue
          if (!queue.includes(neighbor)) {
            queue.push(neighbor);
          }
        }
      });
    }
    //Back trace path
    return graph.backTracePath(arrivedFrom, pathFound, startNode, endNode);
  }
}
