import express, { Router, Request, Response } from "express";
//import { Prisma } from "database";
import prisma from "../bin/database-connection.ts";
//import {flower_requests} from "../../../../packages/database/prisma/client";

const router: Router = express.Router();

// HTTP protocol

router.post("/", async function (req: Request, res: Response) {
  //const FlowerRequestAttempt: Prisma.FlowerRequestsCreateInput = req.body;
  // Attempt to save the high score
  try {
    const { name, priority, location, status, roomNum, startTime, endTime } =
      req.body;
    // Attempt to create in the database
    const serviceRequest = await prisma.serviceRequest.create({
      data: {
        name: name,
        priority,
        location,
        status,
      },
    });
    await prisma.roomScheduling.create({
      data: {
        roomNum,
        startTime,
        endTime,
        servreq: {
          connect: { requestID: serviceRequest.requestID },
        },
      },
    });

    console.info("Successfully saved room request attempt"); // Log that it was successful
  } catch (error) {
    // Log any failures
    console.error(`Unable to save room request attempt: ${error}`);
    res.sendStatus(400);
    return;
  }

  res.sendStatus(200);
});

// Whenever a get request is made, return the high score
router.get("/", async function (req: Request, res: Response) {
  try {
    // Fetch the PatientName and PatientRoom from Prisma
    const serviceRequests = await prisma.serviceRequest.findMany({
      include: {
        RoomScheduling: {
          select: {
            roomNum: true,
            startTime: true,
            endTime: true,
          },
        },
      },
    });
    if (serviceRequests.length === 0) {
      console.error("No room requests have been made!");
      res.sendStatus(204); // Send 204 status if there is no data
    } else {
      console.log("Service requests:", serviceRequests); // Log retrieved data
      res.status(200).json(serviceRequests); // Send JSON response with data
    }
  } catch (error) {
    console.error("Error fetching service requests:", error);
    res.status(500).send("Internal Server Error"); // Send 500 status with error message
  }
});

router.patch("/:requestNumber", async (req: Request, res: Response) => {
  const { requestNumber } = req.params;

  try {
    const updatedRoomScheduling = await prisma.roomScheduling.update({
      where: {
        requestNumber: parseInt(requestNumber),
      },
      data: {
        //status: status,
      },
    });

    res.json(updatedRoomScheduling); // Send the updated flower request object back to the client
  } catch (error) {
    console.error(`Error updating Room request status: ${error}`);
    res.sendStatus(500);
  }
});

export default router;
