import express, { Router, Request, Response } from "express";
import { Prisma } from "database";
import PrismaClient from "../bin/database-connection.ts";
//import {flower_requests} from "../../../../packages/database/prisma/client";

const router: Router = express.Router();

// HTTP protocol

router.post("/", async function (req: Request, res: Response) {
  const FlowerRequestAttempt: Prisma.FlowerRequestsCreateInput = req.body;
  // Attempt to save the high score
  try {
    // Attempt to create in the database
    await PrismaClient.flowerRequests.create({ data: FlowerRequestAttempt });
    console.info("Successfully saved flower request attempt"); // Log that it was successful
  } catch (error) {
    // Log any failures
    console.error(
      `Unable to save flower request attempt ${FlowerRequestAttempt}: ${error}`,
    );
    res.sendStatus(400); // Send error
    return; // Don't try to send duplicate statuses
  }

  res.sendStatus(200); // Otherwise say it's fine
});

// Whenever a get request is made, return the high score
router.get("/", async function (req: Request, res: Response) {
  // Fetch the PatientName and PatientRoom from Prisma
  const flowerRequest = await PrismaClient.flowerRequests.findMany({
    select: {
      orderNumber: true,
      nameRequester: true,
      priority: true,
      location: true,
      typeFlower: true,
      customMessage: true,
      status: true,
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

// router.patch("/:orderNumber", (req, res) => {
//   res.send("PATCH route is working");
// });

router.patch("/:orderNumber", async (req: Request, res: Response) => {
  const { orderNumber } = req.params;
  const { status } = req.body;

  try {
    const updatedFlowerRequest = await PrismaClient.flowerRequests.update({
      where: {
        orderNumber: parseInt(orderNumber),
      },
      data: {
        status: status,
      },
    });

    res.json(updatedFlowerRequest); // Send the updated flower request object back to the client
  } catch (error) {
    console.error(`Error updating flower request status: ${error}`);
    res.sendStatus(500);
  }
});

export default router;
