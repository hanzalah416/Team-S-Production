import client from "../bin/database-connection.ts";
import express, { Router, Request, Response } from "express";
import { Employees } from "database";
import PrismaClient from "../bin/database-connection.ts";

const router: Router = express.Router();

router.get("/", async function (req: Request, res: Response) {
  try {
    const nodes: Employees[] = await client.node.findMany();
    const filteredEmployees = nodes.filter((x) => x.employeeID !== null);
    const formattedEmployees = filteredEmployees.map((employee) => ({
      employeeID: employee.employeeID,
        employeeName: employee.employeeName,
    }));
    res.json(formattedEmployees);
  } catch (error) {
    console.error("Error fetching nodes: ", error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/", async function (req, res) {
  const nodeAttempt: Employees[] = req.body;
  try {
    const filteredEmployees = nodeAttempt.filter((x) => x.employeeID !== null);
    console.log("starting try");
    await PrismaClient.node.deleteMany();
    console.log("deleted old nodes");
    // Attempt to create in the database
    await PrismaClient.node.createMany({
      data: filteredEmployees,
      skipDuplicates: true, // Consider using skipDuplicates to avoid errors on duplicate keys
    });
    console.info("Successfully saved node attempt"); // Log that it was successful
    res.sendStatus(200); // Respond with success status
  } catch (error) {
    console.error(`Unable to save node attempt: ${error}`); // Log failures, making sure to use template literals for variables
    res.sendStatus(400); // Send a failure status
  }
});

module.exports = router;

export default router;
