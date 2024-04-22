import client from "../bin/database-connection.ts";
import express, { Router, Request, Response } from "express";
import { Employees } from "database";
import PrismaClient from "../bin/database-connection.ts";

const router: Router = express.Router();

router.get("/", async function (req: Request, res: Response) {
  try {
    const employees: Employees[] = await client.employees.findMany();
    const filteredEmployees = employees.filter((x) => x.employeeID !== null);
    const formattedEmployees = filteredEmployees.map((employee) => ({
      employeeID: employee.employeeID,
      employeeName: employee.employeeName,
    }));
    res.json(formattedEmployees);
  } catch (error) {
    console.error("Error fetching employees: ", error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/", async function (req, res) {
  const employeeAttempt: Employees[] = req.body;
  employeeAttempt.forEach((employee, index) => {
    employeeAttempt[index].employeeID = employee.employeeID.toString();
  });
  try {
    const filteredEmployees = employeeAttempt.filter(
      (x) => x.employeeID !== null,
    );
    console.log("starting try");
    await PrismaClient.employees.deleteMany();
    console.log("deleted old employees");
    // Attempt to create in the database
    await PrismaClient.employees.createMany({
      data: filteredEmployees,
      skipDuplicates: true, // Consider using skipDuplicates to avoid errors on duplicate keys
    });
    console.info("Successfully saved employee attempt"); // Log that it was successful
    res.sendStatus(200); // Respond with success status
  } catch (error) {
    console.error(`Unable to save employee attempt: ${error}`); // Log failures, making sure to use template literals for variables
    res.sendStatus(400); // Send a failure status
  }
});

module.exports = router;

export default router;
