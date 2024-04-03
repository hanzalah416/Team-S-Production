import express, { Router, Request, Response } from "express";
import client from "../bin/database-connection.ts";
import { Node } from "../../../../packages/database/.prisma/client";

const router: Router = express.Router();

router.get("/", async function (req: Request, res: Response) {
  try {
    const nodes: Node[] = await client.node.findMany();

    const formattedNodes = nodes.map((node) => ({
      id: node.nodeID,
      xcoord: node.xcoord,
      ycoord: node.ycoord,
      longName: node.longName,
    }));

    res.json(formattedNodes);
  } catch (error) {
    console.error("Error fetching nodes: ", error);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
