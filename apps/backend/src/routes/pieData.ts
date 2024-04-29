import express, { Router, Request, Response, NextFunction } from "express";
import prisma from "../bin/database-connection.ts";
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
        requestType: true,
      },
    });
    const pieData = {
      flowerRequest:
        serviceRequests.filter((request) => request.requestType === "Flower") ==
        undefined
          ? 0
          : serviceRequests.filter(
              (request) => request.requestType === "Flower",
            ).length,
      languageRequest:
        serviceRequests.filter(
          (request) => request.requestType === "Language",
        ) == undefined
          ? 0
          : serviceRequests.filter(
              (request) => request.requestType === "Language",
            ).length,
      medicineRequest:
        serviceRequests.filter(
          (request) => request.requestType === "Medicine",
        ) == undefined
          ? 0
          : serviceRequests.filter(
              (request) => request.requestType === "Medicine",
            ).length,
      schedulingRequest:
        serviceRequests.filter(
          (request) => request.requestType === "Room Scheduling",
        ) == undefined
          ? 0
          : serviceRequests.filter(
              (request) => request.requestType === "Room Scheduling",
            ).length,
      sanitationRequest:
        serviceRequests.filter(
          (request) => request.requestType === "Sanitation",
        ) == undefined
          ? 0
          : serviceRequests.filter(
              (request) => request.requestType === "Sanitation",
            ).length,
      securityRequest:
        serviceRequests.filter(
          (request) => request.requestType === "Security",
        ) == undefined
          ? 0
          : serviceRequests.filter(
              (request) => request.requestType === "Security",
            ).length,
      transportRequest:
        serviceRequests.filter(
          (request) => request.requestType === "Transport",
        ) == undefined
          ? 0
          : serviceRequests.filter(
              (request) => request.requestType === "Transport",
            ).length,
      giftRequest:
        serviceRequests.filter((request) => request.requestType === "Gift") ==
        undefined
          ? 0
          : serviceRequests.filter((request) => request.requestType === "Gift")
              .length,
    };

    if (serviceRequests.length === 0) {
      console.error("No requests have been made!");
      res.sendStatus(204);
    } else {
      console.log("Pie Data:", pieData);
      res.status(200).json(pieData);
    }
    next();
  }),
);

export default router;
