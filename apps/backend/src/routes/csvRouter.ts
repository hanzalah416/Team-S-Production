import express, { Router, Request, Response } from "express";
import client from "../bin/database-connection.ts";
import { Node } from "../../../../packages/database/.prisma/client";
import PrismaClient from "../bin/database-connection.ts";
//import { Prisma } from "database";
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

//const express = require('express');
//const router = express.Router();
//const { PrismaClient } = require('@prisma/client');

//const PrismaClientInstance = new PrismaClient();

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
    await PrismaClient.nodeEdge.deleteMany();
    console.log("deleted old edges");
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
