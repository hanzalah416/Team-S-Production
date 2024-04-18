import express, { Router, Request, Response } from "express";
import PrismaClient from "../bin/database-connection.ts";

import { Prisma } from "database";

const router: Router = express.Router();

router.post("/", async function (req: Request, res: Response) {
  const createMedicineAttempt: Prisma.MedicineCreateInput = req.body;
  // Attempt to save the high score
  try {
    // Attempt to create in the database
    await PrismaClient.medicine.create({ data: createMedicineAttempt });
    console.info("Successfully saved medicine to autofill"); // Log that it was successful
  } catch (error) {
    // Log any failures
    console.error(`Unable to save medicine ${createMedicineAttempt}: ${error}`);
    res.sendStatus(400).send("Error with medicine data"); // Send error
    return; // Don't try to send duplicate statuses
  }

  res.sendStatus(200); // Otherwise say it's fine
});

// Whenever a get request is made, return the high score
// The only thing that should be getting is the Username ( I return the userID for now)
router.get("/", async function (req: Request, res: Response) {
  try {
    const medicine = await PrismaClient.medicine.findMany({
      select: {
        genericName: true,
        synName: true,
      },
    });

    if (medicine.length > 0) {
      res.json(medicine[0]);
    } else {
      console.error("medicine not found");
      res.sendStatus(204);
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
