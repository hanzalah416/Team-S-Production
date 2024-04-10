import express, { Router, Request, Response } from "express";
import client from "../bin/database-connection.ts";
import { NodeEdge } from "../../../../packages/database/.prisma/client";
import PrismaClient from "../bin/database-connection.ts";
//import { Prisma } from "database";

const router: Router = express.Router();

router.get("/", async function (req: Request, res: Response) {
  try {
    const nodeEdges: NodeEdge[] = await client.nodeEdge.findMany();
    const filteredNodeEdges = nodeEdges.filter((x) => x.startNode !== null);
    const formattedNodes = filteredNodeEdges.map((NodeEdge) => ({
      startNode: NodeEdge.startNode,
      endNode: NodeEdge.endNode,
    }));
    res.json(formattedNodes);
  } catch (error) {
    console.error("Error fetching nodes: ", error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/", async function (req, res) {
  const EdgeAttempt: NodeEdge[] = req.body;
  console.log(req.body); // Log the request body to see the incoming data
  console.log(EdgeAttempt); // Log the parsed data to be inserted

  try {
    const filteredEdge = EdgeAttempt.filter((x) => x.startNode !== null);
    // Attempt to create in the database
    console.log("start try");
    await PrismaClient.nodeEdge.deleteMany();
    console.log("deleted");
    await PrismaClient.nodeEdge.createMany({
      data: filteredEdge,
      skipDuplicates: true, // Consider using skipDuplicates to avoid errors on duplicate keys
    });
    console.info("Successfully saved Edge attempt"); // Log that it was successful
    res.sendStatus(200); // Respond with success status
  } catch (error) {
    console.error(`Unable to save edge attempt: ${error}`); // Log failures, making sure to use template literals for variables
    res.sendStatus(400); // Send a failure status
  }
});

export default router;
