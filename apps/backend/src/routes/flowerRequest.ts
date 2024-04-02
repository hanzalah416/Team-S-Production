import express, { Router, Request, Response } from "express";
import { Prisma } from "database";
import PrismaClient from "../bin/database-connection.ts";

const router: Router = express.Router();

// HTTP protocol
router.post("/", async function (req: Request, res: Response) {
  const flowerRequestAttempt: Prisma.FlowerRequestsCreateInput = req.body;
  // Attempt to save the high score
  try {
    // Attempt to create in the database
    res.status(200).json({
      message: "hello from backend",
    });
    await PrismaClient.flowerRequests.create({ data: flowerRequestAttempt });
    console.info("Successfully saved flower request"); // Log that it was successful
  } catch (error) {
    // Log any failures
    console.error(
      `Unable to save flower request ${flowerRequestAttempt}: ${error}`,
    );
    res.sendStatus(400).send("Flower request error"); // Send error
    return; // Don't try to send duplicate statuses
  }

  res.sendStatus(200); // Otherwise say it's fine
});

// Whenever a get request is made, return the high score
router.get("/", async function (req: Request, res: Response) {
  // Fetch the PatientName and PatientRoom from Prisma
  const flowerRequest = await PrismaClient.flowerRequests.findMany({
    select: {
      patientName: true,
      PatientRoom: true,
      flowerID: true,
      customMessage: true,
      userID: true,
    },
  });

  // No flower requests exist in the database
  if (flowerRequest === null) {
    // Log that
    console.error("No flower requests have been made!");
    res.sendStatus(204); // and send 204, no data
  } else {
    // Otherwise, send the score
    res.send(flowerRequest);
  }
});

export default router;
