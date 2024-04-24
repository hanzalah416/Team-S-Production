import React, { useEffect, useState } from "react";
import styles from "./StatsPage.module.css"; // Importing the CSS file
import BackgroundImg2 from "../assets/blue-background2.jpg";
import { PieChart } from "@mui/x-charts/PieChart";
//import Button from "@mui/material/Button";
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
type AssignBarData = {
  requestType: string;
  notAssigned: number;
  assigned: number;
  inProgess: number;
  closed: number;
};
type PriorityBarData = {
    requestType: string;
    low: number;
    medium: number;
    high: number;
    emergency: number;
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
  const [, setAssignBar] = useState<AssignBarData[]>([]);
  const [, setPriorityBar] = useState<PriorityBarData[]>([]);

  useEffect(() => {
    async function fetchData() {
      const pie = await axios.get("/api/get-pie-data");
      setPieData(pie.data);
      console.log(pie.data);
      console.log("Successfully got data from get request");
      const assign = await axios.get("/api/assign-data");
        setAssignBar(assign.data);
        console.log(assign.data);
        console.log("Successfully got data from get request");
        const priority = await axios.get("/api/priority-data");
        setPriorityBar(priority.data);
        console.log(priority.data);
        console.log("Successfully got data from get request");
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
            <h1>Number of service requests by request type</h1>
            <div className={styles.pieChartContainer}>
                <PieChart
                    series={[
                        {
                            arcLabelMinAngle: 45,
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
                                {
                                    id: 6,
                                    value: pieData.transportRequest,
                                    label: "Transport Requests",
                                }


                            ],
                        },
                    ]}
                    width={400}
                    height={200}
                />
                {/*<Button onClick={useEffect}></Button>*/}
            </div>

        </div>

    </div>



  );
};

export default Stats;
