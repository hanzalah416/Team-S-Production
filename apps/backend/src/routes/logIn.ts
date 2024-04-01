import express, { Router, Request, Response } from "express";
import { Prisma } from "database";
import PrismaClient from "../bin/database-connection.ts";

const router2: Router = express.Router();

router2.post("/", async function (req: Request, res: Response) {
  const hospitalUserAttempt: Prisma.hospitalUserCreateInput = req.body;
  // Attempt to save the high score
  try {
    // Attempt to create in the database
    await PrismaClient.hospitalUser.create({ data: hospitalUserAttempt });
    console.info("Successfully saved hospitalUser attempt"); // Log that it was successful
  } catch (error) {
    // Log any failures
    console.error(
      `Unable to save high score attempt ${hospitalUserAttempt}: ${error}`,
    );
    res.sendStatus(400).send("Error with User data"); // Send error
    return; // Don't try to send duplicate statuses
  }

  res.sendStatus(200); // Otherwise say it's fine
});

// Whenever a get request is made, return the high score
// The only thing that should be getting is the Username
router2.get("/", async function (req: Request, res: Response) {
  // Fetch the Username of the current users
  // might want to put try and catch in later on
  let userID: string | undefined = undefined;
  // this is to get rid of the type error
  // finds if userID is equal to a string
  if (typeof req.query.userID === "string") {
    userID = req.query.userID;
  }
  // checks if userID is
  if (userID === undefined) {
    res.status(400).send("Invalid userID");
    return;
  }
  const userName = await PrismaClient.hospitalUser.findMany({
    where: {
      userID: userID,
    },
    select: {
      userName: true,
    },
  });
  if (userName.length > 0) {
    res.json(userName[0]);
  }

  // If the high score doesn't exist
  else {
    // Log that (it's a problem)
    console.error("Username is not found");
    res.sendStatus(204); // and send 204, no data
  }
});

export default router2;
