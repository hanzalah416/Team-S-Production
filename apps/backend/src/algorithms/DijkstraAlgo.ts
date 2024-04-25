import { Pathfinder } from "./AlgoPath.ts";
import MakeGraph, { GraphNode } from "../makegraph.ts";

export class DijkstraAlgo extends Pathfinder {
  public GetDistance(
    graph: MakeGraph,
    node: GraphNode,
    goal: GraphNode,
  ): number {
    return graph.getEucDistance(node, goal);
  }
}
