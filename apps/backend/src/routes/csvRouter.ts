import client from "../bin/database-connection.ts";
import express, { Router, Request, Response } from "express";
import { Node } from "database";
import PrismaClient from "../bin/database-connection.ts";

const router: Router = express.Router();

router.get("/", async function (req: Request, res: Response) {
  try {
    const nodes: Node[] = await client.node.findMany();
    const filteredNodes = nodes.filter((x) => x.nodeID !== null);
    const formattedNodes = filteredNodes.map((node) => ({
      nodeID: node.nodeID,
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

router.post("/", async function (req, res) {
  const nodeAttempt: Node[] = req.body;
  console.log("pre-stringification:");
  console.log(nodeAttempt);
  nodeAttempt.forEach((node, index) => {
    nodeAttempt[index].floor = node.floor.toString();
  });
  console.log("post-Stringification:");
  console.log(nodeAttempt);
  //console.log(req.body); // Log the request body to see the incoming data
  //console.log(nodeAttempt); // Log the parsed data to be inserted
  try {
    const filteredNodes = nodeAttempt.filter((x) => x.nodeID !== null);
    console.log("starting try");
    await PrismaClient.node.deleteMany();
    console.log("deleted old nodes");
    // Attempt to create in the database
    await PrismaClient.node.createMany({
      data: filteredNodes,
      skipDuplicates: true, // Consider using skipDuplicates to avoid errors on duplicate keys
    });
    console.info("Successfully saved node attempt"); // Log that it was successful
    res.sendStatus(200); // Respond with success status
  } catch (error) {
    console.error(`Unable to save node attempt: ${error}`); // Log failures, making sure to use template literals for variables
    res.sendStatus(400); // Send a failure status
  }
});

module.exports = router;

export default router;
