import React, { useEffect, useState } from "react";
import axios from "axios";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { MedicineDeliveryForm } from "./MedicineDeliveryForm.ts";
import { MedicineDeliveryDisplay } from "./MedicineDeliveryTable.tsx";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.common.black,
    fontWeight: "bold",
    textAlign: "center",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

export default function MedicineRequestGetter() {
  const [MedicineDeliveryData, setMedicineDeliveryData] = useState<
    MedicineDeliveryForm[]
  >([]);

  useEffect(() => {
    async function fetchData() {
      const res = await axios.get("/api/medicine-request");
      setMedicineDeliveryData(res.data);
      console.log(res.data);
      console.log("successfully got data from get request");
    }
    fetchData().then();
  }, []);

  // Function to update the status of all requests
  const updateMedicineDeliveryStatus = async (
    requestID: number,
    newStatus: string,
  ) => {
    try {
      await axios.patch(`/api/all-requests/${requestID}`, {
        status: newStatus,
      });
      setMedicineDeliveryData((prevData) =>
        prevData.map((request) =>
          request.requestID === requestID
            ? { ...request, status: newStatus }
            : request,
        ),
      );
    } catch (error) {
      console.error("Error updating all request status:", error);
    }
  };

  // Sort the data by orderNumber before rendering
  const sortedLanguageRequestData = [...MedicineDeliveryData].sort(
    (a, b) => a.requestID - b.requestID,
  );

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="center">Request ID</StyledTableCell>
            <StyledTableCell align="center">Requester's Name</StyledTableCell>
            <StyledTableCell align="center">Priority</StyledTableCell>
            <StyledTableCell align="center">Location</StyledTableCell>
            <StyledTableCell align="center">Status</StyledTableCell>
            {/*<StyledTableCell align="right">Order Number</StyledTableCell>*/}
            <StyledTableCell align="center">Medicine Name</StyledTableCell>
            <StyledTableCell align="center">Medicine Type</StyledTableCell>
          </TableRow>
          {/*asdf*/}
        </TableHead>
        <TableBody>
          {sortedLanguageRequestData.map((MedicineDeliveryForm) => (
            <MedicineDeliveryDisplay
              key={MedicineDeliveryForm.requestID}
              MedicineDeliveryForm={MedicineDeliveryForm}
              onUpdateStatus={(newStatus) =>
                updateMedicineDeliveryStatus(
                  MedicineDeliveryForm.requestID,
                  newStatus,
                )
              }
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
