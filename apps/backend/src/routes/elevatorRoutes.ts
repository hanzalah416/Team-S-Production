import express, { Router, Request, Response } from "express";
import prisma from "../bin/database-connection.ts";
const router: Router = express.Router();
router.get("/", async function (req: Request, res: Response) {
  try {
    // Fetch the PatientName and PatientRoom from Prisma
    const returnNodeIds = await prisma.node.findMany({
      where: {
        nodeType: "ELEV",
      },
      select: {
        nodeID: true,
      },
    });
    // No staff exists in the database
    if (returnNodeIds.length === 0) {
      console.error("No elevator node id's in database!");
      res.sendStatus(204);
    } else {
      console.log("Return elevator node id's:", returnNodeIds);
      res.status(200).json(returnNodeIds); // JSON data
    }
  } catch (error) {
    console.error("Error fetching elevator node Id's:", error);
    res.status(500).send("Internal Server Error"); // if not connected
  }
});

export default router;
