import { Node } from "../../../packages/database/.prisma/client";
import { NodeEdge } from "../../../packages/database/.prisma/client";

class MakeGraph {
  private nodeMap: Map<string, GraphNode> = new Map();

  addNode(node: Node): void {
    const temp = new GraphNode(node.nodeID);
    this.nodeMap.set(node.nodeID, temp);
  }

  addEdge(nodeEdge: NodeEdge): void {
    const node1 = this.nodeMap.get(nodeEdge.startNodeID);
    const node2 = this.nodeMap.get(nodeEdge.endNodeID);
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
}

type NBMap = Map<GraphNode, GraphNode>;
// creat class the node in the graph
class GraphNode {
  id: string;
  neighbors: GraphNode[];

  constructor(id: string) {
    this.id = id;
    this.neighbors = [];
  }
  //add neighbor
  addNB(node: GraphNode) {
    this.neighbors.push(node);
  }
}

export default MakeGraph;
