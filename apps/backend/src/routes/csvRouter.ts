import express, { Router, Request, Response } from "express";
import client from "../bin/database-connection.ts";
import { Node } from "../../../../packages/database/.prisma/client";
import PrismaClient from "../bin/database-connection.ts";
import { Prisma } from "database";
import createCsvFile from "../WriteCSV.ts";
import * as path from "path";

const router: Router = express.Router();
const csvPath = path.join(
  path.resolve(path.resolve(path.resolve(__dirname, ".."), ".."), ".."),
  "frontend",
  "src",
  "components",
  "csv_data",
  "Nodes.csv",
);
router.get("/", async function (req: Request, res: Response) {
  try {
    const nodes: Node[] = await client.node.findMany();
    const formattedNodes = nodes.map((node) => ({
      nodeID: node.nodeID,
      xcoord: node.xcoord,
      ycoord: node.ycoord,
      floor: node.floor,
      building: node.building,
      nodeType: node.nodeType,
      longName: node.longName,
      shortName: node.shortName,
    }));
    createCsvFile(
      {
        headers: [
          { id: "nodeID", title: "nodeID" },
          { id: "xcoord", title: "xcoord" },
          { id: "ycoord", title: "ycoord" },
          { id: "floor", title: "floor" },
          { id: "building", title: "building" },
          { id: "nodeType", title: "nodeType" },
          { id: "longName", title: "longName" },
          { id: "shortName", title: "shortName" },
        ],
        data: formattedNodes,
      },
      csvPath,
    );
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
    console.info("Successfully saved node attempt"); // Log that it was successful
  } catch (error) {
    // Log any failures
    console.error(`Unable to save node attempt ${nodeAttempt}: ${error}`);
    res.sendStatus(400); // Send error
    return; // Don't try to send duplicate statuses
  }

  res.sendStatus(200); // Otherwise say it's fine
});

export default router;
