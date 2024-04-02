
class Makegraph {

  private nodeMap: Map<string, GraphNode> = new Map();
  addNode(id: string): void {
    const temp = new GraphNode(id);
    this.nodeMap.set(id, temp);
  }
  addEdge(id1: string, id2: string): void {
    const node1 = this.nodeMap.get(id1);
    const node2 = this.nodeMap.get(id2);
    if (node1 && node2) {
      node1.addNB(node2);
      node2.addNB(node1);
    } else {
      console.error(`nodes not found: ${id1}, ${id2}`);
    }
  }
  //main BFS ,to find a shortest path
  //If start or end is undefined return undefined
  BFS(start: string, end: string) {
    const startNode = this.nodeMap.get(start);
    const endNode = this.nodeMap.get(end);

    //If start or end is undefined return undefined
    if (!startNode || !endNode) {
      console.error("nodes not found.");
      return;
    }
    //Initialize BFS
    const arrivedFrom: NBMap = new Map();
    const queue: GraphNode[] = [startNode];
    arrivedFrom.set(startNode, startNode);

    while (queue.length > 0) {
      const currentNode = queue.shift()!; //get the first the node
      if (currentNode === endNode) {
        break;
      }
      //serching for the goal node
      currentNode.neighbors.forEach((neighbor) => {
        if (!arrivedFrom.has(neighbor)) {
          arrivedFrom.set(neighbor, currentNode);
          queue.push(neighbor);
        }
      });
    }
    //Backtrack for path
    const path: GraphNode[] = [];
    let currentNode = endNode;
    while (currentNode !== startNode) {
      path.push(currentNode);
      currentNode = arrivedFrom.get(currentNode)!;
    }
    path.push(startNode); // Add the start node at the end

    console.log(path.reverse().map((node) => node.id));
    return path;
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

