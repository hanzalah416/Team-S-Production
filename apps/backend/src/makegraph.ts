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
    const temp = new GraphNode(node.nodeID, node.xcoord, node.ycoord);
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
    const costSoFar: Map<GraphNode, number> = new Map(); //Map that stores node cost information
    arrivedFrom.set(startNode, startNode);
    costSoFar.set(startNode, 0);

    let pathFound = false;

    while (queue.length > 0) {
      // Sort the queue based on the total estimated cost from start to end via each node
      queue.sort((a, b) => {
        return (
          (costSoFar.get(a) || Infinity) +
          this.getCost(a, endNode) -
          (costSoFar.get(b) || Infinity) -
          this.getCost(b, endNode)
        );
      });

      //Make the current node the top of the queue (node with the lowest cost)
      const currentNode = queue.shift()!;

      //If the current node is equal to the end node break the loop and begin tracing the path
      if (currentNode === endNode) {
        pathFound = true;
        break;
      }

      //Add available neighbors of the node to the queue
      currentNode.neighbors.forEach((neighbor) => {
        //Cost of the current neighbor
        const newCost = (costSoFar.get(currentNode) || Infinity) + 1;

        //Ensure that the neighbor has not already been checked and if its cost is lower then the
        if (
          !costSoFar.has(neighbor) ||
          newCost < (costSoFar.get(neighbor) || Infinity)
        ) {
          //Add info to the Node parent map for backtracing
          arrivedFrom.set(neighbor, currentNode);

          //Input the neighbors cost in the cost map
          costSoFar.set(neighbor, newCost);

          //If the neighboring node hasn't been queued already push it to the queue
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

  getCost(node: GraphNode, goal: GraphNode): number {
    // Calcuate the distance between two nodes
    return Math.sqrt(
      Math.pow(node.xcoord - goal.xcoord, 2) +
        Math.pow(node.ycoord - goal.ycoord, 2),
    );
  }
}

type NBMap = Map<GraphNode, GraphNode>;
// creat class the node in the graph
class GraphNode {
  id: string;
  neighbors: GraphNode[];
  xcoord: number;
  ycoord: number;

  constructor(id: string, xcoord: number, ycoord: number) {
    this.id = id;
    this.neighbors = [];
    this.xcoord = xcoord;
    this.ycoord = ycoord;
  }
  //add neighbor
  addNB(node: GraphNode) {
    this.neighbors.push(node);
  }
}

export default MakeGraph;
