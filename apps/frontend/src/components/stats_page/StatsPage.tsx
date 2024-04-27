import React, { useEffect, useState } from "react";
// import BackgroundImg2 from "../assets/blue-background2.jpg";
import axios from "axios";
// import Typography from "@mui/material/Typography";;
// import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from "@mui/x-charts/PieChart";

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

  return (
    <div style={{ display: "flex", justifyContent: "flex-start" }}>
      <div style={{ marginRight: "1000px" }}>
        <PieChart
          series={[
            {
              data: [
                {
                  id: 0,
                  value: pieData.securityRequest,
                  label: "Security",
                  color: "",
                },
                {
                  id: 1,
                  value: pieData.transportRequest,
                  label: "Transport",
                  color: "",
                },
                {
                  id: 2,
                  value: pieData.medicineRequest,
                  label: "Medicine",
                  color: "",
                },
                {
                  id: 3,
                  value: pieData.languageRequest,
                  label: "Language",
                  color: "",
                },
                {
                  id: 4,
                  value: pieData.schedulingRequest,
                  label: "Scheduling",
                  color: "",
                },
                { id: 5, value: pieData.giftRequest, label: "Gift" },
                {
                  id: 6,
                  value: pieData.sanitationRequest,
                  label: "Sanitation",
                  color: "",
                },
                {
                  id: 7,
                  value: pieData.flowerRequest,
                  label: "Flower",
                  color: "",
                },
              ],
            },
          ]}
          width={400}
          height={400}
        />
      </div>
    </div>
  );
};

export default Stats;
