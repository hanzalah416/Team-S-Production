import prisma from "../bin/database-connection.ts";
import express, { Router, Request, Response, NextFunction } from "express";

const router: Router = express.Router();

// Defining a type for the request handler
type RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void>;

// Helper function for handling errors and logging
const handleErrorResponse = (
  error: unknown,
  message: string,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(message, error);
  next(error); // Pass the error to the central error handler
};

// Async middleware for error handling
const asyncHandler =
  (fn: RequestHandler): RequestHandler =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      handleErrorResponse(error, "Unexpected error occurred", req, res, next);
    }
  };

router.get(
  "/",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const serviceRequests = await prisma.serviceRequest.findMany({
      select: {
        requestID: true,
        name: true,
        priority: true,
        location: true,
        requestType: true,
        status: true,
      },
    });

    if (serviceRequests.length === 0) {
      console.error("No requests have been made!");
      res.sendStatus(204);
    } else {
      console.log("Service requests:", serviceRequests);
      res.status(200).json(serviceRequests);
    }
    next();
  }),
);

router.patch(
  "/:orderNumber",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const orderNumber = parseInt(req.params.orderNumber);
    if (isNaN(orderNumber)) {
      res.status(400).send("Invalid order number");
      return next();
    }

    const { status } = req.body;

    const updatedServiceRequest = await prisma.serviceRequest.update({
      where: {
        requestID: orderNumber,
      },
      data: {
        status: status,
      },
    });

    if (!updatedServiceRequest) {
      console.error("Request not found with id:", orderNumber);
      res.sendStatus(204);
    } else {
      console.log("Updated service request:", updatedServiceRequest);
      res.status(200).json(updatedServiceRequest);
    }
    next();
  }),
);

export default router;
