import express, { Router, Request, Response } from "express";
import client from "../bin/database-connection.ts";
import PrismaClient from "../bin/database-connection.ts";
const router: Router = express.Router();

import { Node, Prisma } from "database";

router.get("/", async function (res: Response) {
  try {
    const nodes: Node[] = await client.node.findMany();

    const formattedNodes = nodes.map((node) => ({
      id: node.nodeID,
      xcoord: node.xcoord,
      ycoord: node.ycoord,
      floor: node.floor,
      building: node.building,
      nodeType: node.nodeType,
      longName: node.longName,
      shortName: node.shortName,
    }));

    res.json(formattedNodes);
  } catch (error) {
    console.error("Error fetching nodes: ", error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/", async function (req: Request, res: Response) {
  const nodeAttempt: Prisma.NodeCreateInput = req.body;
  // Attempt to save the high score
  try {
    // Attempt to create in the database
    await PrismaClient.node.create({ data: nodeAttempt });
    console.info("Successfully saved high score attempt"); // Log that it was successful
  } catch (error) {
    // Log any failures
    console.error(`Unable to save high score attempt ${nodeAttempt}: ${error}`);
    res.sendStatus(400); // Send error
    return; // Don't try to send duplicate statuses
  }

  res.sendStatus(200); // Otherwise say it's fine
});

export default router;
