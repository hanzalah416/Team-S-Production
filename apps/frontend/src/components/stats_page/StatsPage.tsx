import React, { useEffect, useState } from "react";
import BackgroundImg2 from "../assets/blue-background2.jpg";
import axios from "axios";
// import Typography from "@mui/material/Typography";;
// import { BarChart } from '@mui/x-charts/BarChart';
// import {barElementClasses, PieChart} from "@mui/x-charts";
import { BarChart } from "@mui/x-charts/BarChart";
// import styles from "../stats_page/StatsPage.module.css";
import { PieChart } from "@mui/x-charts";
import Stack from "@mui/material/Stack";
import Tooltip from "../ToolTip.tsx";
import { Grid, Paper } from "@mui/material";
// import {colors} from "@mui/material";
// import {data} from "autoprefixer";
// import {makeStyles} from "@mui/material";
// import {Grid} from "@mui/material";

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
type AssignBarData = {
  requestType: string;
  notAssigned: number;
  assigned: number;
  inProgress: number;
  closed: number;
};
type PriorityBarData = {
  requestType: string;
  low: number;
  medium: number;
  high: number;
  emergency: number;
};

const tips = `
Pie Chart: To find the number of service requests by request type, hover over the region in the pie chart corresponding to the desired service request according to the key. The number of requests for that request type as well as the name of the request type will be shown.

Bar Chart (Status): To find the distribution of statuses for each service request, hover over the region for the desired service request, and the number of unassigned requests, assigned requests, in progress requests and closed requests there are for that service request.

Bar Chart (Priority): Similarly to the status bar chart, hover over the region for the desired request, and the number of low priority requests, medium priority requests, high priority requests and emergency requests there are for that service request.  
`;
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
  const [assignBar, setAssignBar] = useState<AssignBarData[]>([]);
  const [priorityBar, setPriorityBar] = useState<PriorityBarData[]>([]);

  useEffect(() => {
    async function fetchData() {
      const pie = await axios.get("/api/get-pie-data");

      console.log(pie);
      setPieData(pie.data);
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
      }}
    >
      <Grid
        container
        spacing={5}
        direction="column"
        alignItems="center"
        justifyContent="center"
        my={4}
      >
        {" "}
        <br />
        <br />
        <Paper elevation={4} style={{ padding: 20 }}>
          <p
            className={"title"}
            style={{ position: "relative", fontSize: "60px" }}
          >
            Statistics
            <Tooltip
              style={{ position: "absolute", right: "20px", top: 0 }}
              tips={tips}
            />
          </p>
          <br />
          <div className={"breakline"}></div>
          <Stack alignItems="center" justifyContent="center" spacing={3} p={4}>
            <h2
              className={"title"}
              style={{ position: "relative", fontSize: "35px" }}
            >
              Service requests by request type
            </h2>
            <PieChart
              series={[
                {
                  data: [
                    {
                      id: 0,
                      value: pieData.securityRequest,
                      label: "Security Request",
                      color: "blue",
                    },
                    {
                      id: 1,
                      value: pieData.transportRequest,
                      label: "Transportation Request",
                      color: "green",
                    },
                    {
                      id: 2,
                      value: pieData.medicineRequest,
                      label: "Medicine Request",
                      color: "red",
                    },
                    {
                      id: 3,
                      value: pieData.languageRequest,
                      label: "Language Request",
                      color: "orange",
                    },
                    {
                      id: 4,
                      value: pieData.schedulingRequest,
                      label: "Scheduling Request",
                      color: "yellow",
                    },
                    {
                      id: 5,
                      value: pieData.giftRequest,
                      label: "Gift Request",
                      color: "teal",
                    },
                    {
                      id: 6,
                      value: pieData.sanitationRequest,
                      label: "Sanitation Request",
                      color: "pink",
                    },
                    {
                      id: 7,
                      value: pieData.flowerRequest,
                      label: "Flower Request",
                      color: "purple",
                    },
                  ],
                },
              ]}
              width={800}
              height={600}
              margin={{
                left: 100,
                top: 80,
                bottom: 80,
              }}
              slotProps={{
                legend: {
                  direction: "row",
                  position: { vertical: "top", horizontal: "right" },
                  padding: 0,
                },
              }}
              sx={{
                "& .MuiPieArc-root": {
                  stroke: "#000", // Black border
                  strokeWidth: 2, // Width of the border
                },
                "& .MuiChartsLegend-series text": {
                  fill: "#3B54A0 !important",
                },
              }}
            />
            <div className={"breakline"}></div>
            <h2
              className={"title"}
              style={{ position: "relative", fontSize: "35px" }}
            >
              Service Requests by Status
            </h2>
            <BarChart
              dataset={assignBar}
              xAxis={[
                {
                  scaleType: "band",
                  dataKey: "requestType",
                },
              ]}
              series={[
                { dataKey: "notAssigned", label: "Unassigned" },
                { dataKey: "assigned", label: "Assigned" },
                { dataKey: "inProgess", label: "In Progress" },
                { dataKey: "closed", label: "Closed" },
              ]}
              width={830}
              height={300}
              sx={{
                "& .MuiChartsLegend-series text": {
                  fill: "#3B54A0 !important",
                },
              }}
            />
            <div className={"breakline"}></div>
            <h2
              className={"title"}
              style={{ position: "relative", fontSize: "35px" }}
            >
              Service Requests by Priority
            </h2>
            <BarChart
              dataset={priorityBar}
              xAxis={[{ scaleType: "band", dataKey: "requestType" }]}
              series={[
                { dataKey: "low", label: "Low Priority" },
                { dataKey: "medium", label: "High Priority" },
                { dataKey: "high", label: "Medium Priority" },
                { dataKey: "emergency", label: "Emergency" },
              ]}
              width={830}
              height={300}
              sx={{
                "& .MuiChartsLegend-series text": {
                  fill: "#3B54A0 !important",
                },
              }}
            />
          </Stack>
        </Paper>
      </Grid>
    </div>
  );
};

export default Stats;
