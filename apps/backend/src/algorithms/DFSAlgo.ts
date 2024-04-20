import MakeGraph from "../makegraph.ts";
import { GraphNode, Pathfinding } from "../makegraph.ts";

export class DFSAlgo implements Pathfinding {
  public findPath(graph: MakeGraph, start: string, end: string) {
    const startNode = graph.nodeMap.get(start);
    const endNode = graph.nodeMap.get(end);

    // Check if the nodes are within the graph
    if (startNode === undefined || endNode === undefined) {
      return [];
    }
    const visited: GraphNode[] = [];
    const arrivedFrom = new Map<GraphNode, GraphNode>();
    const stack: GraphNode[] = [];

    // Initialize DFS
    arrivedFrom.set(startNode, startNode);
    stack.push(startNode);
    let pathFound = false;
    // Main DFS loop
    while (stack.length != 0) {
      // Grab the first node
      const currNode = stack.pop()!;
      // destination
      if (currNode == endNode) {
        pathFound = true;
        break;
      }
      // Keep searching
      for (const neighbor of currNode.neighbors) {
        if (arrivedFrom.has(neighbor)) {
          continue;
        }
        arrivedFrom.set(neighbor, currNode);
        if (visited.indexOf(neighbor) < 0) {
          stack.push(neighbor);
          visited.push(neighbor);
        }
      }
    }
    return graph.backTracePath(arrivedFrom, pathFound, startNode, endNode);
  }
}
