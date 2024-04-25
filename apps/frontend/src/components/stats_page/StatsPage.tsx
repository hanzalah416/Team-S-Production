import React, { useEffect, useState } from "react";
import BackgroundImg2 from "../assets/blue-background2.jpg";;
import axios from "axios";
import Typography from "@mui/material/Typography";
import {Grid} from "@mui/material";
import {PieChart, Bar, Legend, Pie, XAxis, YAxis, Tooltip, Cell, CartesianGrid, BarChart} from "recharts";


type PieData = {
  flowerRequest: number;
  languageRequest: number;
  medicineRequest: number;
  schedulingRequest: number;
  sanitationRequest: number;
  securityRequest: number;
  transportRequest: number;
    giftRequest: number,
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
      giftRequest: 0,
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

    const pieChartData = [
        { name: 'Flower Requests', value: pieData.flowerRequest, color: '#ff0000'},
        { name: 'Language Requests', value: pieData.languageRequest, color: '#00ff00'},
        { name: 'Medicine Requests', value: pieData.medicineRequest, color: '#0000ff'},
        { name: 'Sanitation Requests', value: pieData.sanitationRequest, color: '#ffff00' },
        { name: 'Scheduling Requests', value: pieData.schedulingRequest, color: '#ff00ff'},
        { name: 'Security Requests', value: pieData.securityRequest, color:'#00ffff'},
        { name: 'Transportation Requests', value: pieData.transportRequest, color: '#ffa500'},
        { name: 'Gift Requests', value: pieData.giftRequest, color:'#00ffff'},
        { name: 'Language Requests', value: pieData.languageRequest, color: '#ffa500'},
    ];

    const barChartData = [
        { name: 'Category 1', value: 100 },
        { name: 'Category 2', value: 200 },
        { name: 'Category 3', value: 300 },
        { name: 'Category 4', value: 400 },
        { name: 'Category 5', value: 500 },
        { name: 'Category 6', value: 600 },
        { name: 'Category 7', value: 700 },
    ];



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
      
            <Typography variant="h4" gutterBottom>
                Statistics
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Typography variant="h6">Service requests by service type</Typography>
                    <PieChart width={600} height={600}>
                        <Pie
                            dataKey="value"
                            data={pieChartData}
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            fill="#8884d8"
                            label
                        >
                            {pieChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>

                        <Legend wrapperStyle={{ bottom: 0, left: '50%', transform: 'translateX(-40%)' }} layout="horizontal"/>
                    </PieChart>
                </Grid>


                <Grid item xs={12} md={6}>
                    <Typography variant="h6">Bar Graph</Typography>
                    <BarChart width={500} height={300} data={barChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                </Grid>
            </Grid>
        
    </div>



  );
};

export default Stats;
