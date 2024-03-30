import express, { Router, Request, Response } from "express";
import Graph from "./makegraph";
//import readCSV from "./readCSV";  --- TOdo change this // import { Prisma } from "database";
                                                  // import PrismaClient from "../bin/database-connection.ts";

const router: Router = express.Router();

router.get("/pathfind", async function (req: Request, res: Response) {
    const graph = new Graph();

  TOdo // const nodes = await readCSV('L1Nodes.csv');
  //const edges = await readCSV('L1Edges.csv');

    // Add all nodes to graph
    nodes.forEach(nodeProperties => {
        graph.addNode(nodeProperties[0]);
    });

    // Add all edges to graph
    edges.forEach(edge => {
        graph.addEdge(edge[0], edge[1]);
    });

     //pathfinding using BFS
    const { startNodeID, endNodeID } = req.body;
    const path: string[] = graph.BFS(startNodeID, endNodeID);

    // Check
    path.length === 0 ? res.sendStatus(204) : res.json({ pathNodeIDs: path });
  } catch (error) {
    console.error("Error by pathfinding: ", error);
  }
);

export default router;
