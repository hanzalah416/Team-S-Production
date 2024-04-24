import React from "react";
import styles from "./StatsPage.module.css"; // Importing the CSS file
import BackgroundImg2 from "../assets/blue-background2.jpg";
import { PieChart } from "@mui/x-charts/PieChart";

const Stats = () => {
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
      <div className={styles.creditsContainer}>
        <PieChart
          series={[
            {
              data: [
                { id: 0, value: 10, label: "series A" },
                { id: 1, value: 15, label: "series B" },
                { id: 2, value: 25, label: "series C" },
              ],
            },
          ]}
          width={400}
          height={200}
        />
      </div>
    </div>
  );
};

export default Stats;
