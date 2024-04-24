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

  useEffect(() => {
    async function fetchData() {
      const res = await axios.get("/api/get-pie-data");
      setPieData(res.data);
      console.log(res.data);
      console.log("successfully got data from get request");
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
