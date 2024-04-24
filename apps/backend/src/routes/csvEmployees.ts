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
  const employeeAttempt: Employees[] = req.body.map((employee: any) => ({
    employeeName: employee.employeeName,
  }));

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
    });
    console.info("Successfully saved employee attempt");
    res.sendStatus(200);
  } catch (error) {
    console.error(`Unable to save employee attempt: ${error}`);
    res.sendStatus(400);
  }
});

module.exports = router;

export default router;
