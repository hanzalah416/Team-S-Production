import React, { useEffect, useState } from "react";
import axios from "axios";
import { ServiceRequestDisplay } from "./AllServiceRequestsTable.tsx";
import { allRequestForm } from "../../common/allRequestForm.ts";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

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

export function ServiceRequestGetter() {
  const [allRequestData, setAllRequestData] = useState<allRequestForm[]>([]);

  useEffect(() => {
    async function fetchData() {
      const res = await axios.get("/api/all-requests");
      setAllRequestData(res.data);
      console.log(res.data);
      console.log("successfully got data from get request");
    }
    fetchData().then();
  }, []);

  // Function to update the status of all requests
  const updateAllRequestStatus = async (
    requestID: number,
    newStatus: string,
  ) => {
    try {
      await axios.patch(`/api/all-requests/${requestID}`, {
        status: newStatus,
      });
      setAllRequestData((prevData) =>
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
  const sortedAllRequestData = [...allRequestData].sort(
    (a, b) => a.requestID - b.requestID,
  );

  return (
    <div className="flex flex-col gap-5">
      <header>Service Request Data</header>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Requester ID</StyledTableCell>
              <StyledTableCell align="right">Requester's Name</StyledTableCell>
              <StyledTableCell align="right">Priority</StyledTableCell>
              <StyledTableCell align="right">Location</StyledTableCell>
              <StyledTableCell align="right">Type of Request</StyledTableCell>
              <StyledTableCell align="right">Status</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedAllRequestData.map((allRequestForm) => (
              <ServiceRequestDisplay
                key={allRequestForm.requestID}
                allRequestForm={allRequestForm}
                onUpdateStatus={(newStatus) =>
                  updateAllRequestStatus(allRequestForm.requestID, newStatus)
                }
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
