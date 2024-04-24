import client from "../bin/database-connection.ts";
import express, { Router, Request, Response } from "express";
import MakeGraph from "../makegraph";

import { Node, NodeEdge } from "database";

const router: Router = express.Router();

router.post("/", async function (req: Request, res: Response) {
  try {
    // Extract startNode, endNode, and algorithm from the request body
    const { startNode, endNode, algorithm } = req.body;

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

    const path = graph.findPath(startNode, endNode);

    const pathIds = path!.map((node) => node.id).reverse();

    if (!pathIds || pathIds.length === 0) {
      res.sendStatus(204); // No Content
    } else {
      res.json({ id: pathIds }); // Send the path as response
    }
  } catch (error) {
    console.error("Error by pathfinding:", error);
    res.status(400).send("Pathfinding failed");
  }
});

export default router;
