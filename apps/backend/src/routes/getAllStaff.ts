import express, { Router, Request, Response } from "express";
import prisma from "../bin/database-connection.ts";
const router: Router = express.Router();
router.get("/", async function (req: Request, res: Response) {
  try {
    // Fetch the PatientName and PatientRoom from Prisma

    const returnStaff = await prisma.employees.findMany({});

    // No staff exists in the database
    if (returnStaff.length === 0) {
      console.error("No staff in database!");
      res.sendStatus(204);
    } else {
      console.log("Return staff:", returnStaff);
      res.status(200).json(returnStaff);
    }
  } catch (error) {
    console.error("Error fetching service requests:", error);
    res.status(500).send("Internal Server Error"); // if not connected
  }
});

export default router;
