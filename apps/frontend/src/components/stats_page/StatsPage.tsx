import React, {useEffect, useState} from "react";
import BackgroundImg2 from "../assets/blue-background2.jpg";
import axios from "axios";
// import Typography from "@mui/material/Typography";;
// import { BarChart } from '@mui/x-charts/BarChart';
import {PieChart} from "@mui/x-charts";
import {BarChart} from '@mui/x-charts/BarChart';
import styles from "../stats_page/StatsPage.module.css";
import {axisClasses} from "@mui/x-charts";
import Stack from "@mui/material/Stack";
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

    const chartSetting = {
        yAxis: [
            {
                label: 'rainfall (mm)',
            },
        ],
        width: 500,
        height: 300,
        sx: {
            [`.${axisClasses.left} .${axisClasses.label}`]: {
                transform: 'translate(-20px, 0)',
            },
        },
    };


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

        <div style={{
            backgroundImage: `url(${BackgroundImg2})`,
            height: "100vh",
            width: "100vw",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            minHeight: "100%",
            backgroundPosition: "center center",
            overflowX: "hidden",
        }}>

            <h1 className={styles.heading} style={{
                color: "white"

            }}> Site Statistics</h1>
            <Stack alignItems="center" justifyContent="center" spacing={3} p={4}>
            <h2 className={styles.alignStuff}
                style={{
                    color: "white"

                }}>
                Service requests by number of requests</h2>
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
                                color: "white",
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
                        direction: 'row',
                        position: {vertical: 'bottom', horizontal: 'right'},
                        padding: 0,
                    },
                }}
                sx={{
                    "& .MuiChartsLegend-series text": {
                        fill: "white !important",
                    },
                    "& .MuiTypography-root": {
                        color: "white !important", // Ensure that chart title color is white
                    },
                }}
            />


            <h1 className={styles.alignStuff}
                style={{
                    color: "white"

                }}>Service Requests by Status</h1>
            <BarChart
                className = {styles.alignChart}
                dataset={assignBar}
                xAxis={
                    [

                        {
                            scaleType: 'band',
                            dataKey: "requestType",


                        }


                    ]

                }
                series={[
                    {dataKey: "notAssigned", label: "Unassigned"},
                    {dataKey: "assigned", label: "Assigned"},
                    {dataKey: "inProgess", label: "In Progress"},
                    {dataKey: "closed", label: "Closed"},

                ]}
                {...chartSetting}
                width={830}
                height={300}


                sx={{
                    "& .MuiChartsLegend-series text": {
                        color: "yellow !important",
                        fill: "white !important",
                    },
                }}
            />

            <h1 className={styles.alignStuff}
                style={{
                    color: "white"

                }}>Service Requests by Priority</h1>
            <BarChart
                dataset={priorityBar}
                xAxis={[{scaleType: 'band', dataKey: "requestType"}]
                }

                series={[
                    {dataKey: "low", label: "Low Priority"},
                    {dataKey: "medium", label: "High Priority"},
                    {dataKey: "high", label: "Medium Priority"},
                    {dataKey: "emergency", label: "Emergency"},

                ]}

                width={800}
                height={300}

                sx={{
                    "& .MuiChartsLegend-series text": {
                        color: "yellow !important",
                        fill: "white !important",
                    },
                    "& .MuiTypography-root": {
                        color: "white !important", // Ensure that chart title color is white
                    },
                }}
            />
            </Stack>

        </div>
    );
};

export default Stats;
