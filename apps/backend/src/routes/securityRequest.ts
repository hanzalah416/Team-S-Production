import express, { Router, Request, Response } from "express";
import prisma from "../bin/database-connection.ts";

const securityRouter: Router = express.Router();

// HTTP protocol

securityRouter.post("/", async function (req: Request, res: Response) {
  // Attempt to save the high score
  try {
    const { name, priority, location, status, securityType, threatType } =
      req.body;
    // Attempt to create in the database
    const serviceRequest = await prisma.serviceRequest.create({
      data: {
        name: name,
        priority,
        location,
        requestType: "Security",
        status,
      },
    });

    // Connect servreq to the newly created Security request

    await prisma.securityRequest.create({
      data: {
        securityType,
        threatType,
        servreq: {
          connect: { requestID: serviceRequest.requestID },
        },
      },
    });

    console.info("Successfully saved security request attempt"); // Log that it was successful
  } catch (error) {
    // Log any failures
    console.error(`Unable to save security request attempt: ${error}`);
    res.sendStatus(400); // Send error
    return; // Don't try to send duplicate statuses
  }

  res.sendStatus(200); // Otherwise say it's fine
});

// Whenever a get request is made, return the high score
securityRouter.get("/", async function (req: Request, res: Response) {
  try {
    // Fetch the PatientName and PatientRoom from Prisma
    const serviceRequests = await prisma.serviceRequest.findMany({
      where: {
        requestType: "Security",
      },
      include: {
        SecurityRequests: {
          select: {
            threatType: true,
            securityType: true,
          },
        },
      },
    });
    // No Security requests exist in the database
    if (serviceRequests.length === 0) {
      console.error("No security requests have been made!");
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

securityRouter.patch("/:orderNumber", async (req: Request, res: Response) => {
  const { orderNumber } = req.params;
  const { status } = req.body;

  try {
    const updatedSecurityRequest = await prisma.serviceRequest.update({
      where: {
        requestID: parseInt(orderNumber),
      },
      data: {
        status: status,
      },
    });

    res.json(updatedSecurityRequest); // Send the updated Security request object back to the client
  } catch (error) {
    console.error(`Error updating security request status: ${error}`);
    res.sendStatus(500);
  }
});

export default securityRouter;
