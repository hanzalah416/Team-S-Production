import { Pathfinder } from "./AlgoPath.ts";
import MakeGraph, { GraphNode } from "../makegraph.ts";

export class AStarAlgo extends Pathfinder {
  public GetDistance(
    graph: MakeGraph,
    node: GraphNode,
    goal: GraphNode,
    sameFloor: boolean,
  ): number {
    return graph.getCost(node, goal, sameFloor);
  }
}
