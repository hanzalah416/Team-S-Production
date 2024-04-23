import express, { Router, Request, Response } from "express";
import PrismaClient from "../bin/database-connection.ts";
const router: Router = express.Router();

import { NodeEdge, Prisma } from "database";
import prisma from "../bin/database-connection.ts";

router.get("/", async function (req: Request, res: Response) {
  try {
    const edges: NodeEdge[] = await PrismaClient.nodeEdge.findMany();
    const formattedEdges = edges.map((edge) => ({
      startNode: edge.startNode,
      endNode: edge.endNode,
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

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedEdge = await prisma.nodeEdge.delete({
      where: {
        edgeID: id,
      },
    });

    if (!deletedEdge) {
      console.error("No node found with the given ID!");
      res.sendStatus(204); // No Content, the edge was not found
    } else {
      console.log("Deleted edge:", deletedEdge);
      res.status(200).json(deletedEdge); // Successfully deleted the edge
    }
  } catch (error) {
    console.error(`Error deleting edge : ${error}`);
    res.sendStatus(500); // Internal Server Error
  }
});

export default router;
