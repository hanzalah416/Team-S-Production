import express, { Router, Request, Response } from "express";
//import { Prisma } from "database";
import prisma from "../bin/database-connection.ts";
//import {flower_requests} from "../../../../packages/database/prisma/client";

const router: Router = express.Router();

// HTTP protocol

router.post("/", async function (req: Request, res: Response) {
  // Attempt to save medicial request
  try {
    const { name, priority, location, status, typeMedicine, nameMedicine } =
      req.body;
    // Attempt to create in the database
    const serviceRequest = await prisma.serviceRequest.create({
      data: {
        name,
        priority,
        location,
        requestType: "Medicine",
        status,
      },
    });

    // Creates the medicine request specific fields
    await prisma.medicineRequests.create({
      data: {
        typeMedicine,
        nameMedicine,
        servreq: {
          connect: { requestID: serviceRequest.requestID },
        },
      },
    });

    console.info("Successfully saved medicine request attempt"); // Log that it was successful
  } catch (error) {
    // Log any failures
    console.error(`Unable to save medicine request attempt: ${error}`);
    res.sendStatus(400); // Send error
    return; // Don't try to send duplicate statuses
  }

  res.sendStatus(200); // Otherwise say it's fine
});

// Whenever a get request is made, return the high score
router.get("/", async function (req: Request, res: Response) {
  try {
    // Fetch the PatientName and PatientRoom from Prisma
    const serviceRequests = await prisma.serviceRequest.findMany({
      where: {
        requestType: "Medicine",
      },
      include: {
        MedicineRequests: {
          select: {
            typeMedicine: true,
            nameMedicine: true,
          },
        },
      },
    });
    // No flower requests exist in the database
    if (serviceRequests.length === 0) {
      console.error("No flower requests have been made!");
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
// router.patch("/:orderNumber", (req, res) => {
//   res.send("PATCH route is working");
// });

router.patch("/:orderNumber", async (req: Request, res: Response) => {
  const { requestID } = req.params;
  const { status } = req.body;

  try {
    const updatedMedicineRequest = await prisma.serviceRequest.update({
      where: {
        requestID: parseInt(requestID),
      },
      data: {
        status: status,
      },
    });

    res.json(updatedMedicineRequest); // Send the updated flower request object back to the client
  } catch (error) {
    console.error(`Error updating flower request status: ${error}`);
    res.sendStatus(500);
  }
});

export default router;
