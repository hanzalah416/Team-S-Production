import React, { useEffect, useState } from "react";
import styles from "./StatsPage.module.css"; // Importing the CSS file
import BackgroundImg2 from "../assets/blue-background2.jpg";
import { PieChart } from "@mui/x-charts/PieChart";
import Button from "@mui/material/Button";
import axios from "axios";

type PieData = {
  flowerRequest: number;
  languageRequest: number;
  medicineRequest: number;
  schedulingRequest: number;
  sanitationRequest: number;
  securityRequest: number;
  transportRequest: number;
};
type Employee = {
    employeeID: string,
    employeeName: string,
};
type Requests = {
    requestID: number,
    name: string,
    priority: string,
    location: string,
    requestType: string,
    status: string,
};
const Stats = () => {
  const [pieData, setPieData] = useState<PieData>({
    flowerRequest: 0,
    languageRequest: 0,
    medicineRequest: 0,
    schedulingRequest: 0,
    sanitationRequest: 0,
    securityRequest: 0,
      transportRequest: 0,
  });
  const [employeeData, setEmployeeData] = useState<Employee[]>([]);
  const [requestData, setRequestData] = useState<Requests[]>([]);

  useEffect(() => {
    async function fetchData() {
      const pie = await axios.get("/api/get-pie-data");
      setPieData(pie.data);
      console.log(pie.data);
      console.log("Successfully got data from get request");
      const emp = await axios.get("/api/employee-csv");
      setEmployeeData(emp.data);
      console.log(emp.data);
      console.log("Successfully got employee data from get request");
      const req = await axios.get("/api/all-requests");
      setRequestData(req.data);
      console.log(req.data);
      console.log("Successfully got request data from get request");
    }
    fetchData().then();
  }, []);
  return (
    <div
      style={{
        backgroundImage: `url(${BackgroundImg2})`,
        height: "100vh",
        width: "100vw",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        minHeight: "100%",
        backgroundPosition: "center center",
        overflowX: "hidden",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className={styles.statsContainer}>
        <PieChart
          series={[
            {
              data: [
                {
                  id: 0,
                  value: pieData.flowerRequest,
                  label: "Flower Requests",
                },
                {
                  id: 1,
                  value: pieData.languageRequest,
                  label: "Language Requests",
                },
                {
                  id: 2,
                  value: pieData.medicineRequest,
                  label: "Medicine Requests",
                },
                {
                  id: 3,
                  value: pieData.sanitationRequest,
                  label: "Sanitation Requests",
                },
                {
                  id: 4,
                  value: pieData.schedulingRequest,
                  label: "Scheduling Requests",
                },
                {
                  id: 5,
                  value: pieData.securityRequest,
                  label: "Security Requests",
                },
              ],
            },
          ]}
          width={400}
          height={200}
        />
          <Button onClick={useEffect}></Button>
      </div>
    </div>
  );
};

export default Stats;
