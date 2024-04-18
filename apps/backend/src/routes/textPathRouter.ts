import express, { Router, Request, Response } from "express";
import MakeGraph, { GraphNode } from "../makegraph";
import client from "../bin/database-connection.ts";
import { Node } from "database";
import { NodeEdge } from "database";
import { PathToText } from "../textPath.ts";

const router: Router = express.Router();

router.post("/", async function (req: Request, res: Response) {
  try {
    const graph = new MakeGraph();

    // Get data from the database to for node and edge variables
    const nodes = await client.node.findMany();
    const edges = await client.nodeEdge.findMany();

    // Add nodes and edges to the graph
    nodes.forEach((node: Node) => {
      graph.addNode(node);
    });
    edges.forEach((edge: NodeEdge) => {
      graph.addEdge(edge);
    });

    // Extract startNode, endNode, and algorithm from the request body
    const { startNode, endNode, algorithm } = req.body;
    console.log(
      "Received start and end nodes:",
      startNode,
      endNode,
      "using algorithm:",
      algorithm,
    );

    let path: GraphNode[] = [];
    switch (algorithm) {
      case "dijkstra":
        path = graph.Dijsktra(startNode, endNode);
        break;
      case "bfs":
        path = graph.BFS(startNode, endNode);
        break;
      case "dfs":
        path = graph.DFS(startNode, endNode);
        break;
      case "astar":
        path = graph.AStar(startNode, endNode);
        break;
      default:
        console.error("Unsupported pathfinding algorithm");
    }

    const textDirectionsRaw = PathToText(path.reverse());
    const textDirectionsFilteredJSON = JSON.stringify(
      textDirectionsRaw.map((direction) => direction.toJson()),
    );
    const textDirectionsFiltered = JSON.parse(textDirectionsFilteredJSON);

    if (!textDirectionsFiltered || textDirectionsFiltered.length === 0) {
      res.sendStatus(204); // No Content
    } else {
      res.json(textDirectionsFiltered); // Send the path as response
    }
  } catch (error) {
    console.error("Error by text to path:", error);
    res.status(400).send("Text to path failed");
  }
});

export default router;
