import express, { Router, Request, Response } from "express";
import client from "../bin/database-connection.ts";
import { NodeEdge } from "../../../../packages/database/.prisma/client";
import PrismaClient from "../bin/database-connection.ts";
import { Prisma } from "database";

const router: Router = express.Router();

router.get("/", async function (req: Request, res: Response) {
  try {
    const nodeEdges: NodeEdge[] = await client.nodeEdge.findMany();

    const formattedNodes = nodeEdges.map((NodeEdge) => ({
      startNodeID: "startNodeID_value",
      endNodeID: "endNodeID_value",
    }));
    res.json(formattedNodes);
  } catch (error) {
    console.error("Error fetching nodes: ", error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/", async function (req: Request, res: Response) {
  const nodeEdgeAttempt: Prisma.NodeEdgeCreateInput = req.body;
  // Attempt to save the high score
  try {
    // Attempt to create in the database
    await PrismaClient.nodeEdge.create({ data: nodeEdgeAttempt });
    console.info("Successfully saved node attempt"); // Log that it was successful
  } catch (error) {
    // Log any failures
    console.error(`Unable to save node attempt ${nodeEdgeAttempt}: ${error}`);
    res.sendStatus(400); // Send error
    return; // Don't try to send duplicate statuses
  }

  res.sendStatus(200); // Otherwise say it's fine
});

export default router;
