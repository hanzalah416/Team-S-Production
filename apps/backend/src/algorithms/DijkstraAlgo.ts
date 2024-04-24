import { Pathfinder } from "./AlgoPath.ts";
import MakeGraph from "../makegraph.ts";

export class DijkstraAlgo extends Pathfinder {
  public pathFinding(graph: MakeGraph) {
    while (this.queue.length > 0) {
      // Sort the queue based on the total estimated cost from start to end via each node
      this.queue.sort((a, b) => {
        return this.fCost.get(a)! - this.fCost.get(b)!;
      });

      //Make the current node the top of the queue (node with the lowest cost)
      const currentNode = this.queue.shift()!;
      this.closedList.push(currentNode);

      //If the current node is equal to the end node break the loop and begin tracing the path
      if (currentNode === this.endNode) {
        this.pathFound = true;
        break;
      }

      //Add available neighbors of the node to the queue
      currentNode.neighbors.forEach((neighbor) => {
        //See if node has already been added

        if (!this.closedList.includes(neighbor)) {
          if (!this.arrivedFrom.has(neighbor)) {
            this.arrivedFrom.set(neighbor, currentNode);
          }

          //Calculate the g,h, and f cost for the nodes and add them to the map
          const gCostNeighbor =
            this.gCost.get(currentNode)! +
            graph.getEucDistance(neighbor, currentNode);
          const hCostNeighbor = graph.getEucDistance(neighbor, this.endNode!);
          const fCostNeighbor = gCostNeighbor + hCostNeighbor;

          //Set the costs for neighbors
          this.gCost.set(neighbor, gCostNeighbor);
          this.hCost.set(neighbor, hCostNeighbor);
          this.fCost.set(neighbor, fCostNeighbor);

          //Check if node is already in the open queue
          if (!this.queue.includes(neighbor)) {
            this.queue.push(neighbor);
          }
        }
      });
    }
    //Back trace path
    return graph.backTracePath(
      this.arrivedFrom,
      this.pathFound,
      this.startNode!,
      this.endNode!,
    );
  }
}
