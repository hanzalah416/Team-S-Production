import MakeGraph from "../makegraph.ts";
import { GraphNode, NBMap, Pathfinding } from "../makegraph.ts";

export class BFSAlgo implements Pathfinding {
  public findPath(graph: MakeGraph, start: string, end: string) {
    const startNode = graph.nodeMap.get(start);
    const endNode = graph.nodeMap.get(end);

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

    //Back trace path
    return graph.backTracePath(arrivedFrom, pathFound, startNode, endNode);
  }
}
