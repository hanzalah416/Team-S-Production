import client from "../bin/database-connection.ts";
import express, { Router, Request, Response } from "express";
import MakeGraph from "../makegraph";

import { Node, NodeEdge } from "database";
import { ReturnClosestNode } from "../algorithms/ReturnClosestNode.ts";

const router: Router = express.Router();

router.post("/", async function (req: Request, res: Response) {
  try {
    // Extract startNode, endNode, and algorithm from the request body
    const { startNode, endNodes, algorithm } = req.body;

    const graph = new MakeGraph(algorithm);

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

    /*
        console.log(
          "Received start and end nodes:",
          startNode,
          endNode,
          "using algorithm:",
          algorithm,
        );
         */

    const closestId = ReturnClosestNode(startNode, endNodes, graph);

    if (!closestId) {
      res.sendStatus(204); // No Content
    } else {
      res.json(closestId); // Send the path as response
    }
  } catch (error) {
    console.error("Error by pathfinding:", error);
    res.status(400).send("Pathfinding failed");
  }
});

export default router;
