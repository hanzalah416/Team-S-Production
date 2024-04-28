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
  "Room Scheduling",
  "Sanitation",
  "Security",
  "Transport",
  "Gift",
];
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const serviceRequests = await prisma.serviceRequest.findMany({
      select: {
        status: true,
        requestType: true,
      },
    });
    const priority = [];
    for (const type of serviceTypes) {
      priority.push({
        requestType: type,
        notAssigned: serviceRequests.filter(
          (request) =>
            request.requestType == type && request.status == "unassigned",
        ).length,
        assigned: serviceRequests.filter(
          (request) =>
            request.requestType == type && request.status == "assigned",
        ).length,
        inProgess: serviceRequests.filter(
          (request) =>
            request.requestType == type && request.status == "in_progress",
        ).length,
        closed: serviceRequests.filter(
          (request) =>
            request.requestType == type && request.status == "closed",
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
