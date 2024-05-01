import React from "react";
import checkMark from "../assets/checkmark.webp";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import BackgroundImg2 from "../assets/blue-background2.jpg";
import "../AllMobile.css";

const MobileOrderConfirm = () => {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate("/");
  };

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
      <div className={"mainBox"}>
        <h2 className={"title-mobile"}>Request Confirmation</h2>
        <p className={"names-mobile"}>
          Request placed! Awaiting staff assignment.
        </p>
        <img src={checkMark} alt="Confirmation Checkmark" />
        <div className={"buttonReturn-mobile"}>
          <Button
            style={{
              backgroundColor: "#3B54A0",
            }}
            variant="contained"
            onClick={handleBack}
            sx={{ minWidth: 250, minHeight: 50, fontSize: 18 }}
          >
            Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobileOrderConfirm;
