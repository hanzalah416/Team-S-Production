import * as React from "react";
import Tabs from "../../TabComponent.tsx";
import OutlinedAlerts from "../ServiceNotice.tsx";
import { ServiceRequestGetter } from "./AllServiceRequestsGetter.tsx";
import { LanguageRequestGetter } from "../language_requests/LanguageRequestTableHead.tsx";
import MedicineRequestGetter from "../medicine_delivery/MedicineDeliveryTable.tsx";

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
    <p>order flowers</p>,
    <MedicineRequestGetter />,
    <p>Sanitation Services</p>,
    <p>Security</p>,
    <p>room schedling</p>,
    <LanguageRequestGetter />,
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
