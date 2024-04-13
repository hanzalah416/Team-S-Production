import express, { Router, Request, Response } from "express";
import MakeGraph from "../makegraph";
import client from "../bin/database-connection.ts";
import { Node } from "../../../../packages/database";
import { NodeEdge } from "../../../../packages/database";

const router: Router = express.Router();

router.post("/", async function (req: Request, res: Response) {
  try {
    const graph = new MakeGraph();

    //Get data from the database to for node and edge variables
    const nodes = await client.node.findMany();
    const edges = await client.nodeEdge.findMany();

    nodes.forEach((node: Node) => {
      graph.addNode(node);
    });

    edges.forEach((edge: NodeEdge) => {
      graph.addEdge(edge);
    });

    const { startNode: startNode, endNode: endNode } = req.body;

    console.log("Received start and end nodes", startNode, endNode);

    const path = graph.Dijsktra(startNode, endNode);

    if (!path) {
      throw new Error("Path was undefined");
    }

    path.length == 0 ? res.sendStatus(204) : res.json({ id: path });
  } catch (error) {
    console.error("Error by pathfinding: ", error);
    res.status(400).send("Path was undefined");
  }
});

export default router;
