import PrismaClient from "../bin/database-connection.ts";
import express, { Router, Request, Response } from "express";
import seed from "../seed.ts";

const router: Router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    await seed();
    await PrismaClient.$disconnect();
    res.status(200).send({ message: "Reset completed successfully." });
  } catch (error) {
    console.error(error);
    await PrismaClient.$disconnect();
    // Assert that error is of type Error to access message property
    const message = (error as Error).message;
    res.status(500).send({ message: "Failed to reset data.", error: message });
  }
});

export default router;
