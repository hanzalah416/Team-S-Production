import PrismaClient from "../bin/database-connection.ts";
import express, { Router } from "express";

import seed from "../seed.ts";

const router: Router = express.Router();
router.post("/", async () => {
  seed()
    .then(async () => {
      await PrismaClient.$disconnect();
    })
    .catch(async (e) => {
      console.error(e);
      await PrismaClient.$disconnect();
    });
});

export default router;
