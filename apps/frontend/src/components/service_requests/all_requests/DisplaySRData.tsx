import * as React from "react";
import Tabs from "../../TabComponent.tsx";
import OutlinedAlerts from "../ServiceNotice.tsx";
import { ServiceRequestGetter } from "./AllServiceRequestsGetter.tsx";
import { LanguageRequestGetter } from "../language_requests/LanguageRequestTableHead.tsx";
import MedicineRequestGetter from "../medicine_delivery/MedicineDeliveryTableHead.tsx";
import FlowerRequestGetter from "../flower_requests/FlowerRequestTableHead.tsx";
import SanitationGetter from "../sanitation_services/SanitationTableHead.tsx";
import SecurityGetter from "../security_requests/SecurityTableHead.tsx";
import RoomGetter from "../Room_Scheduling/RoomTableHeader.tsx";
import TransportationGetter from "../internalTransportation/TransportationTableHead.tsx";
import GiftGetter from "../gift_request/giftTableHead.tsx";

export default function DisplaySRData() {
  const tabNames = [
    "All Requests",
    "Order Flowers",
    "Medical Delivery",
    "Sanitation Services",
    "Security Requests",
    "Room Scheduling",
    "Language Requests",
  ];

  const tabContent = [
    <ServiceRequestGetter />,
    <FlowerRequestGetter />,
    <MedicineRequestGetter />,
    <SanitationGetter />,
      <GiftGetter />,
    <SecurityGetter />,
    <RoomGetter />,
    <LanguageRequestGetter />,
    <TransportationGetter />,

  ];

  return (
    <div>
          <h1>Service Request Data</h1>
          <br />
          <Tabs tabNames={tabNames} tabContents={tabContent} />
          <OutlinedAlerts />
    </div>
  );
}
