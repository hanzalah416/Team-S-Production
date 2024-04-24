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
const serviceTypes = [
  "Flower",
  "Language",
  "Medicine",
  "Scheduling",
  "Sanitation",
  "Security",
  "Transport",
];
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const serviceRequests = await prisma.serviceRequest.findMany({
      select: {
        priority: true,
        requestType: true,
      },
    });
    const priority = [];
    for (const type in serviceTypes) {
      priority.push({
        requestType: type,
        low: serviceRequests.filter(
          (request) => request.requestType == type && request.priority == "Low",
        ).length,
        medium: serviceRequests.filter(
          (request) =>
            request.requestType == type && request.priority == "Medium",
        ).length,
        high: serviceRequests.filter(
          (request) =>
            request.requestType == type && request.priority == "High",
        ).length,
        emergency: serviceRequests.filter(
          (request) =>
            request.requestType == type && request.priority == "Emergency",
        ).length,
      });
    }

    if (serviceRequests.length === 0) {
      console.error("No requests have been made!");
      res.sendStatus(204);
    } else {
      console.log("Pie Data:", priority);
      res.status(200).json(priority);
    }
    next();
  }),
);

export default router;
