import express, { Router, Request, Response } from "express";

import MakeGraph from "../makegraph.ts";

import readCSV from "../Readcsv.ts";
/*
import { Prisma } from "database";
import PrismaClient from "../bin/database-connection.ts";
 */

const router: Router = express.Router();

router.get("/pathfind", async function (req: Request, res: Response) {
  try {
    const graph = new MakeGraph();

    const nodes = readCSV("L1Nodes.csv");
    const edges = readCSV("L1Edges.csv");

    // Add all nodes to graph
    nodes.forEach((nodeProperties) => {
      graph.addNode(nodeProperties[0]);
    });

    // Add all edges to graph
    edges.forEach((edge) => {
      graph.addEdge(edge[0], edge[1]);
    });

    //pathfinding using BFS
    const { startNodeID, endNodeID } = req.body;
    const path = graph.BFS(startNodeID, endNodeID);
    if (!path) {
      throw new Error("Path was undefined");
    }
    // Check
    path.length === 0 ? res.sendStatus(204) : res.json({ pathNodeIDs: path });
  } catch (error) {
    console.error("Error by pathfinding: ", error);
    res.sendStatus(400).send("Path was undefined");
  }
});

export default router;
