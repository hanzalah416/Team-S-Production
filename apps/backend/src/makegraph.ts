import { Node } from "../../../packages/database";
import { NodeEdge } from "../../../packages/database";

type Algorthim = (
  graph: MakeGraph,
  startNode: string,
  endNode: string,
) => string[];
export const breadthFirst: Algorthim = (
  graph: MakeGraph,
  startNode: string,
  endNode: string,
) => {
  return graph.BFS(startNode, endNode);
};
export const selectSearchMethod = (
  algorthim: Algorthim,
  graph: MakeGraph,
  startNode: string,
  endNode: string,
) => algorthim(graph, startNode, endNode);

class MakeGraph {
  private nodeMap: Map<string, GraphNode> = new Map();

  addNode(node: Node): void {
    const temp = new GraphNode(
      node.nodeID,
      node.xcoord,
      node.ycoord,
      node.nodeType,
      node.floor,
    );
    this.nodeMap.set(node.nodeID, temp);
  }

  addEdge(nodeEdge: NodeEdge): void {
    const node1 = this.nodeMap.get(nodeEdge.startNode);
    const node2 = this.nodeMap.get(nodeEdge.endNode);
    if (node1 && node2) {
      node1.addNB(node2);
      node2.addNB(node1);
    } else {
      console.error(`nodes not found: ${nodeEdge}`);
    }
  }

  //main BFS ,to find a shortest path
  //If start or end is undefined return undefined
  BFS(start: string, end: string): string[] {
    const startNode = this.nodeMap.get(start);
    const endNode = this.nodeMap.get(end);

    if (!startNode || !endNode) {
      console.error("nodes not found.");
      return [];
    }

    const arrivedFrom: NBMap = new Map();
    const queue: GraphNode[] = [startNode];
    arrivedFrom.set(startNode, startNode);

    let pathFound = false;

    while (queue.length > 0) {
      const currentNode = queue.shift()!;
      if (currentNode === endNode) {
        pathFound = true;
        break;
      }
      currentNode.neighbors.forEach((neighbor) => {
        if (!arrivedFrom.has(neighbor)) {
          arrivedFrom.set(neighbor, currentNode);
          queue.push(neighbor);
        }
      });
    }

    if (!pathFound) {
      console.log("No path found");
      return [];
    }

    const path: GraphNode[] = [];
    let currentNode = endNode;
    while (currentNode !== startNode) {
      path.push(currentNode);
      currentNode = arrivedFrom.get(currentNode)!;
    }
    path.push(startNode);

    // Convert the path of GraphNode objects to an array of node IDs
    const pathIds = path.map((node) => node.id).reverse();
    console.log("Path found:", pathIds);
    return pathIds;
  }
  AStar(start: string, end: string): string[] {
    //Get start and end nodes from map
    const startNode = this.nodeMap.get(start);
    const endNode = this.nodeMap.get(end);

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
    let sameFloor = false;
    if (startNode.floor === endNode.floor) {
      sameFloor = true;
      console.log(sameFloor);
    }
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
            this.getCost(neighbor, currentNode, sameFloor);
          const hCostNeighbor = this.getCost(neighbor, endNode, sameFloor);
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

    //If a path was not fund return an empty array
    if (!pathFound) {
      console.log("No path found");
      return [];
    }

    //Trace back the path through the arrived from map
    const path: GraphNode[] = [];
    let currentNode = endNode;
    while (currentNode !== startNode) {
      path.push(currentNode);
      currentNode = arrivedFrom.get(currentNode)!;
    }
    path.push(startNode);

    // Convert the path of GraphNode objects to an array of node IDs
    const pathIds = path.map((node) => node.id).reverse();
    console.log("Path found:", pathIds);
    return pathIds;
  }

  getCost(node: GraphNode, goal: GraphNode, sameFloor: boolean): number {
    // Calcuate the distance between two nodes
    const distance = Math.sqrt(
      Math.pow(node.xcoord - goal.xcoord, 2) +
        Math.pow(node.ycoord - goal.ycoord, 2),
    );

    //Calculate distance between floors
    const floorDif = Math.abs(
      this.getFloorNum(node.floor) - this.getFloorNum(goal.floor),
    );
    let floorCost = 0;

    // Adjust the cost based on node types only if start and end nodes are on different floors
    if (floorDif > 0) {
      if (node.nodeType === "ELEV" || goal.nodeType === "ELEV") {
        floorCost = 4 * floorDif; // Adjust weight for elevators
      } else if (node.nodeType === "STAI" || goal.nodeType === "STAI") {
        floorCost = 8 * floorDif; // Adjust weight for stairs
      }
    }
    //If it's on the same floor don't switch floors unless really needed
    if (sameFloor) {
      if (node.nodeType === "ELEV" || goal.nodeType === "ELEV") {
        floorCost = 10000000 * floorDif; // Adjust weight for elevators
      } else if (node.nodeType === "STAI" || goal.nodeType === "STAI") {
        floorCost = 30000000 * floorDif; // Adjust weight for stairs
      }
    }

    return distance + floorCost;
  }

  getFloorNum(floor: string) {
    switch (floor) {
      case "L1":
        return 1;
        break;
      case "L2":
        return 2;
        break;
      case "1":
        return 3;
        break;
      case "2":
        return 4;
        break;
      case "3":
        return 5;
        break;
      default:
        return 0;
    }
  }
}

type NBMap = Map<GraphNode, GraphNode>;
// creat class the node in the graph
class GraphNode {
  id: string;
  neighbors: GraphNode[];
  xcoord: number;
  ycoord: number;
  nodeType: string;
  floor: string;
  constructor(
    id: string,
    xcoord: number,
    ycoord: number,
    nodeType: string,
    floor: string,
  ) {
    this.id = id;
    this.neighbors = [];
    this.xcoord = xcoord;
    this.ycoord = ycoord;
    this.nodeType = nodeType;
    this.floor = floor;
  }
  //add neighbor
  addNB(node: GraphNode) {
    this.neighbors.push(node);
  }
}

export default MakeGraph;
