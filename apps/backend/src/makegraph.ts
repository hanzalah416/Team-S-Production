import { Node } from "../../../packages/database";
import { NodeEdge } from "../../../packages/database";
import { AStarAlgo } from "./algorithms/AStarAlgo.ts";
import { BFSAlgo } from "./algorithms/BFSAlgo.ts";
import { DijkstraAlgo } from "./algorithms/DijkstraAlgo.ts";
import { DFSAlgo } from "./algorithms/DFSAlgo.ts";

export interface Pathfinding {
  findPath(graph: MakeGraph, startNode: string, endNode: string): GraphNode[];
}

class MakeGraph {
  private _nodeMap: Map<string, GraphNode> = new Map();
  private _pathFinding: Pathfinding | undefined;

  get nodeMap(): Map<string, GraphNode> {
    return this._nodeMap;
  }
  set nodeMap(value: Map<string, GraphNode>) {
    this._nodeMap = value;
  }
  get pathFinding(): Pathfinding | undefined {
    return this._pathFinding;
  }
  set pathFinding(value: Pathfinding) {
    this._pathFinding = value;
  }

  constructor(algo: string) {
    //Ensure algorithm is lowercase
    algo.toLowerCase();

    //Decide the algorithm
    switch (algo) {
      case "astar":
        this.pathFinding = new AStarAlgo();
        break;
      case "bfs":
        this.pathFinding = new BFSAlgo();
        break;
      case "dijkstra":
        this.pathFinding = new DijkstraAlgo();
        break;
      case "dfs":
        this.pathFinding = new DFSAlgo();
        break;
    }
  }
  findPath(graph: MakeGraph, start: string, end: string) {
    return this._pathFinding!.findPath(graph, start, end);
  }

  addNode(node: Node): void {
    const temp = new GraphNode(
      node.nodeID,
      node.xcoord,
      node.ycoord,
      node.nodeType,
      node.floor,
      node.longName,
    );
    this._nodeMap.set(node.nodeID, temp);
  }

  addEdge(nodeEdge: NodeEdge): void {
    const node1 = this._nodeMap.get(nodeEdge.startNode);
    const node2 = this._nodeMap.get(nodeEdge.endNode);
    if (node1 && node2) {
      node1.addNB(node2);
      node2.addNB(node1);
    } else {
      console.error(`nodes not found: ${nodeEdge}`);
    }
  }

  backTracePath(
    arrivedFrom: NBMap,
    pathFound: boolean,
    startNode: GraphNode,
    endNode: GraphNode,
  ) {
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

    //console.log("Path found:", pathIds);
    return path;
  }
  //Gets the euclidean distance between nodes
  getEucDistance(node: GraphNode, goal: GraphNode): number {
    const distance = Math.sqrt(
      Math.pow(node.xcoord - goal.xcoord, 2) +
        Math.pow(node.ycoord - goal.ycoord, 2),
    );
    return distance;
  }
  getCost(node: GraphNode, goal: GraphNode, sameFloor: boolean): number {
    // Calculate the distance between two nodes
    const distance = this.getEucDistance(node, goal);

    //Calculate distance between floors
    const floorDif = Math.abs(
      getFloorNum(node.floor) - getFloorNum(goal.floor),
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
}

export function getFloorNum(floor: string) {
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

export type NBMap = Map<GraphNode, GraphNode>;
// creat class the node in the graph
export class GraphNode {
  id: string;
  neighbors: GraphNode[];
  xcoord: number;
  ycoord: number;
  nodeType: string;
  floor: string;
  longName: string;
  constructor(
    id: string,
    xcoord: number,
    ycoord: number,
    nodeType: string,
    floor: string,
    longName: string,
  ) {
    this.id = id;
    this.neighbors = [];
    this.xcoord = xcoord;
    this.ycoord = ycoord;
    this.nodeType = nodeType;
    this.floor = floor;
    this.longName = longName;
  }
  //add neighbor
  addNB(node: GraphNode) {
    this.neighbors.push(node);
  }
}

export default MakeGraph;
