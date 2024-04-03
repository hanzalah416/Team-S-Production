import express, { Router, Request, Response } from "express";
import { Prisma } from "database";
import PrismaClient from "../bin/database-connection.ts";

const router: Router = express.Router();

router.post("/", async function (req: Request, res: Response) {
  const hospitalUserAttempt: Prisma.hospitalUserCreateInput = req.body;
  // Attempt to save the high score
  try {
    // Attempt to create in the database
    await PrismaClient.hospitalUser.create({ data: hospitalUserAttempt });
    console.info("Successfully saved hospitalUser attempt"); // Log that it was successful
  } catch (error) {
    // Log any failures
    console.error(
      `Unable to save Hospital user login attempt ${hospitalUserAttempt}: ${error}`,
    );
    res.sendStatus(400).send("Error with User data"); // Send error
    return; // Don't try to send duplicate statuses
  }

  res.sendStatus(200); // Otherwise say it's fine
});

// Whenever a get request is made, return the high score
// The only thing that should be getting is the Username ( I return the userID for now)
router.get("/", async function (req: Request, res: Response) {
  try {
    const userName: string = req.query.userName as string;

    const logIn = await PrismaClient.hospitalUser.findFirst({
      where: {
        userName: userName,
      },
      select: {
        userName: true,
        userPassword: true,
      },
    });

    if (logIn != null) {
      res.json(logIn);
    } else {
      console.error("Username not found");
      res.sendStatus(204);
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
