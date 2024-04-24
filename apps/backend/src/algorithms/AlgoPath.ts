import MakeGraph from "../makegraph.ts";
import { GraphNode, NBMap, Pathfinding } from "../makegraph.ts";

export abstract class Pathfinder implements Pathfinding {
  startNode: GraphNode | undefined;
  endNode: GraphNode | undefined;
  gCost: Map<GraphNode, number> = new Map();
  hCost: Map<GraphNode, number> = new Map();
  fCost: Map<GraphNode, number> = new Map();
  pathFound: boolean = false;
  sameFloor: boolean = false;
  arrivedFrom: NBMap = new Map();
  queue: GraphNode[] = [];
  closedList: GraphNode[] = [];

  public findPath(graph: MakeGraph, start: string, end: string) {
    this.setUpGraph(graph, start, end);
    return this.pathFinding(graph);
  }

  public setUpGraph(graph: MakeGraph, start: string, end: string) {
    //Get start and end nodes from map
    this.startNode = graph.nodeMap.get(start);
    this.endNode = graph.nodeMap.get(end);

    //Ensure that the start and end nodes are not identical
    if (!this.startNode || !this.endNode) {
      console.error("nodes not found.");
      return [];
    }

    this.queue = [this.startNode]; //Queue of open nodes
    this.arrivedFrom.set(this.startNode, this.startNode); //Add arrived from for the start node

    //Set start node costs
    this.gCost.set(this.startNode, 0);
    this.hCost.set(this.startNode, 0);
    this.fCost.set(this.startNode, 0);

    //Set end node costs
    this.gCost.set(this.endNode, 0);
    this.hCost.set(this.endNode, 0);
    this.fCost.set(this.endNode, 0);

    if (this.startNode.floor === this.endNode.floor) {
      this.sameFloor = true;
      console.log(this.sameFloor);
    }
  }

  abstract pathFinding(graph: MakeGraph): GraphNode[];
}
