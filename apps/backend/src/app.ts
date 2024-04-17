import createError, { HttpError } from "http-errors";
import express, { Express, NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import flowerRequestRouter from "./routes/flowerRequest.ts";
import PrismaClient from "./bin/database-connection.ts";
import seed from "./seed.ts";
import logInRouter from "./routes/newAccount.ts";
import languageRouter from "./routes/languageRequest.ts";
const app: Express = express(); // Setup the backend
import pathfinderRouter from "./routes/getShortestPath.ts";
import nodeRouter from "./routes/getNodes.ts";
import csvRouter from "./routes/csvRouter.ts";
import nodeEdgeRouter from "./routes/nodeEdge.ts";
import allEdgeRouter from "./routes/getAllEdgesData.ts";
import medicineRouter from "./routes/MedicineRoute.ts";
import allRequests from "./routes/allServiceRequests.ts";
import securityRouter from "./routes/securityRequest.ts";
import sanitationRouter from "./routes/saniationRoute.ts";
import roomSchedulingRouter from "./routes/roomScheduling.ts";
import textPathRouter from "./routes/textPathRouter.ts";
import MedsForAutofillRouter from "./routes/MedsForAutofillRoutes.ts";
import { auth } from "express-oauth2-jwt-bearer";

// import allEdgesRouter from "./routes/getAllEdgesData.ts";
// import allNodeRouter from "./routes/getAllNodeData.ts";
// Populate the database
seed()
  .then(async () => {
    await PrismaClient.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await PrismaClient.$disconnect();
  });
// Setup generic middlewear
app.use(
  logger("dev", {
    stream: {
      // This is a "hack" that gets the output to appear in the remote debugger :)
      write: (msg) => console.info(msg),
    },
  }),
); // This records all HTTP requests
app.use(express.json()); // This processes requests as JSON
app.use(express.urlencoded({ extended: false })); // URL parser
app.use(cookieParser()); // Cookie parser

// Setup routers. ALL ROUTERS MUST use /api as a start point, or they
// won't be reached by the default proxy and prod setup
app.use("/api/flower-request", flowerRequestRouter);
app.use("/api/sanitation-request", sanitationRouter);
// app.use("/api/log-in", logInRouter);
app.use("/api/nodeEdge", nodeEdgeRouter);
app.use("/api/csv", csvRouter);
app.use("/api/create-user", logInRouter);
app.use("/api/pathfind", pathfinderRouter);
app.use("/api/nodes", nodeRouter);
app.use("/api/edges", allEdgeRouter);
app.use("/api/medicine-request", medicineRouter);
app.use("/api/all-requests", allRequests);
app.use("/api/meds-autofill", MedsForAutofillRouter);
// app.use("/api/all-node-data", allNodeRouter);
// app.use("/api/all-edges-data", allEdgesRouter);
app.use("/api/security-request", securityRouter);
app.use("/api/room-scheduling", roomSchedulingRouter);
app.use("/api/pathToText", textPathRouter);
app.use("/api/language-request", languageRouter);

app.use("/healthcheck", (req, res) => {
  res.status(200).send();
});

app.use(
  //comment
  auth({
    audience: "/api",
    issuerBaseURL: "https://dev-q6nptoajn7kajoxf.us.auth0.com/",
    tokenSigningAlg: "RS256",
  }),
);

// main().then(() => {
//     console.log('Data populated successfully!');
// }).catch(err => {
//     console.error('Error populating data:', err);
// });

/**
 * Catch all 404 errors, and forward them to the error handler
 */
app.use(function (req: Request, res: Response, next: NextFunction): void {
  // Have the next (generic error handler) process a 404 error
  next(createError(404));
});

/**
 * Generic error handler
 */
app.use((err: HttpError, req: Request, res: Response): void => {
  res.statusMessage = err.message; // Provide the error message

  res.locals.error = req.app.get("env") === "development" ? err : {};

  // Reply with the error
  res.status(err.status || 500);
});

export default app; // Export the backend, so that www.ts can start it
