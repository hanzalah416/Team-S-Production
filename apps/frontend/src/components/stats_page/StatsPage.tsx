import React, { useEffect, useState } from "react";
// import BackgroundImg2 from "../assets/blue-background2.jpg";
import axios from "axios";
import Typography from "@mui/material/Typography";
import { Grid } from "@mui/material";
// import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from "@mui/x-charts/PieChart";

type PieData = {
  flowerRequest: number;
  languageRequest: number;
  medicineRequest: number;
  schedulingRequest: number;
  sanitationRequest: number;
  securityRequest: number;
  transportRequest: number;
  giftRequest: number;
};
// type AssignBarData = {
//   requestType: string;
//   notAssigned: number;
//   assigned: number;
//   inProgess: number;
//   closed: number;
// };
// type PriorityBarData = {
//     requestType: string;
//     low: number;
//     medium: number;
//     high: number;
//     emergency: number;
// };

const Stats = () => {
  const [pieData, setPieData] = useState<PieData>({
    flowerRequest: 0,
    languageRequest: 0,
    medicineRequest: 0,
    schedulingRequest: 0,
    sanitationRequest: 0,
    securityRequest: 0,
    transportRequest: 0,
    giftRequest: 0,
  });
  // const [assignBar, setAssignBar] = useState<AssignBarData[]>([]);
  // const [priorityBar, setPriorityBar] = useState<PriorityBarData[]>([]);

  useEffect(() => {
    async function fetchData() {
      const pie = await axios.get("/api/get-pie-data");

      console.log(pie);
      setPieData(pie.data);
      console.log("Successfully got data from get request");
      // const assign = await axios.get("/api/assign-data");
      //   setAssignBar(assign.data);
      //   console.log(assign.data);
      //   console.log("Successfully got data from get request");
      //   const priority = await axios.get("/api/priority-data");
      //   setPriorityBar(priority.data);
      //   console.log(priority.data);
      //   console.log("Successfully got data from get request");
    }
    fetchData().then();
  }, []);

  const pieChartData = [
    { name: "Flower Requests", value: pieData.flowerRequest, color: "#ff0000" },
    {
      name: "Language Requests",
      value: pieData.languageRequest,
      color: "#00ff00",
    },
    {
      name: "Medicine Requests",
      value: pieData.medicineRequest,
      color: "#0000ff",
    },
    {
      name: "Sanitation Requests",
      value: pieData.sanitationRequest,
      color: "#ffff00",
    },
    {
      name: "Scheduling Requests",
      value: pieData.schedulingRequest,
      color: "#ff00ff",
    },
    {
      name: "Security Requests",
      value: pieData.securityRequest,
      color: "#00ffff",
    },
    {
      name: "Transportation Requests",
      value: pieData.transportRequest,
      color: "#ffa500",
    },
    { name: "Gift Requests", value: pieData.giftRequest, color: "#00ffff" },
  ];

  return (
    <div
    // style={{
    //   backgroundImage: `url(${BackgroundImg2})`,
    //   height: "100vh",
    //   width: "100vw",
    //   backgroundSize: "cover",
    //   backgroundRepeat: "no-repeat",
    //   minHeight: "100%",
    //   backgroundPosition: "center center",
    //   overflowX: "hidden",
    //   display: "flex",
    //   flexWrap: "wrap",
    //   alignItems: "center",
    //   justifyContent: "center",
    // }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6">Service requests by service type</Typography>
          <PieChart
            series={[
              {
                data: pieChartData,
              },
            ]}
            width={400}
            height={200}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default Stats;
