import express, { Router, Request, Response } from "express";
import PrismaClient from "../bin/database-connection.ts";
import { NodeEdge, Prisma } from "../../../../packages/database/.prisma/client";

const router: Router = express.Router();

router.get("/", async function (req: Request, res: Response) {
  try {
    const edges: NodeEdge[] = await PrismaClient.nodeEdge.findMany();

    const formattedEdges = edges.map((edge) => ({
      startNode: edge.startnode,
      endNode: edge.endnode,
    }));

    res.json(formattedEdges);
  } catch (error) {
    console.error("Error fetching edges: ", error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/", async function (req: Request, res: Response) {
  const edgeAttempt: Prisma.NodeEdgeCreateInput = req.body;
  try {
    await PrismaClient.nodeEdge.create({ data: edgeAttempt });
    console.info("Successfully saved edge"); // Log that it was successful
    res.sendStatus(200); // Send success status
  } catch (error) {
    console.error(`Unable to save edge ${edgeAttempt}: ${error}`);
    res.sendStatus(400); // Send error status
  }
});

export default router;
