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
                requestID: true,
                name: true,
                priority: true,
                location: true,
                requestType: true,
                status: true,
            },
        });
        const pieData = {
            "flowerRequest": serviceRequests.filter(request => request.requestType === "FlowerRequest").length,
            "languageRequest": serviceRequests.filter(request => request.requestType === "LanguageRequest").length,
            "medicineRequest": serviceRequests.filter(request => request.requestType === "MedicineRequest").length,
            "schedulingRequest": serviceRequests.filter(request => request.requestType === "SchedulingRequest").length,
            "sanitationRequest": serviceRequests.filter(request => request.requestType === "SanitationRequest").length,
            "securityRequest": serviceRequests.filter(request => request.requestType === "SecurityRequest").length,
            "serviceRequest": serviceRequests.filter(request => request.requestType === "ServiceRequest").length,
            //"transportRequest": serviceRequests.filter(request => request.requestType === "TransportRequest").length,
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
