import client from "../bin/database-connection.ts";
import express, { Router, Request, Response } from "express";
import prisma from "../bin/database-connection.ts";

import { Node, Prisma } from "database";

const router: Router = express.Router();

router.get("/", async function (req: Request, res: Response) {
  try {
    const nodes: Node[] = await client.node.findMany();

    const formattedNodes = nodes.map((node) => ({
      id: node.nodeID,
      xcoord: node.xcoord,
      ycoord: node.ycoord,
      longName: node.longName,
      shortName: node.shortName,
      floor: node.floor,
      nodeType: node.nodeType, // Include nodeType
      building: node.building, // Include building
    }));

    formattedNodes.sort((a, b) => a.longName.localeCompare(b.longName));

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
    await prisma.node.create({ data: nodeAttempt });
    console.info("Successfully saved high score attempt"); // Log that it was successful
  } catch (error) {
    // Log any failures
    console.error(`Unable to save high score attempt ${nodeAttempt}: ${error}`);
    res.sendStatus(400); // Send error
    return; // Don't try to send duplicate statuses
  }

  res.sendStatus(200); // Otherwise say it's fine
});

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { xcoord, ycoord, floor, longName, building, nodeType, shortName } =
    req.body;

  try {
    const updatedNode = await prisma.node.update({
      where: {
        nodeID: id,
      },
      data: {
        xcoord: parseInt(xcoord, 10),
        ycoord: parseInt(ycoord, 10),
        floor: floor,
        shortName: shortName,
        longName: longName,
        building: building,
        nodeType: nodeType,
      },
    });

    if (!updatedNode) {
      console.error("No node found with the given ID!");
      res.sendStatus(204); // No Content, the node was not found
    } else {
      console.log("Updated node details:", updatedNode);
      res.status(200).json(updatedNode); // Successfully updated the node
    }
  } catch (error) {
    console.error(`Error updating node details: ${error}`);
    res.sendStatus(500); // Internal Server Error
  }
});

export default router;
