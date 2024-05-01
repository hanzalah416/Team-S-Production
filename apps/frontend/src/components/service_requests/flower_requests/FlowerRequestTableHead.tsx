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
import { FlowerRequestForm } from "./FlowerRequestForm.ts";
import { FlowerRequestDisplay } from "./FlowerRequestTable.tsx";

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

export default function FlowerRequestGetter() {
  const [FlowerRequestData, setFlowerRequestData] = useState<
    FlowerRequestForm[]
  >([]);

  useEffect(() => {
    async function fetchData() {
      const res = await axios.get("/api/flower-request");
      setFlowerRequestData(res.data);
      console.log(res.data);
      console.log("successfully got data from get request");
    }
    fetchData().then();
  }, []);

  // Function to update the status of all requests
  const updateFlowerRequestStatus = async (
    requestID: number,
    newStatus: string,
  ) => {
    try {
      await axios.patch(`/api/all-requests/${requestID}`, {
        status: newStatus,
      });
      setFlowerRequestData((prevData) =>
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
  const sortedFlowerRequestData = [...FlowerRequestData].sort(
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
            <StyledTableCell align="center">Flower Type</StyledTableCell>
            <StyledTableCell align="center">Custom Message</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedFlowerRequestData.map((FlowerRequestForm) => (
            <FlowerRequestDisplay
              key={FlowerRequestForm.requestID}
              FlowerRequestForm={FlowerRequestForm}
              onUpdateStatus={(newStatus) =>
                updateFlowerRequestStatus(
                  FlowerRequestForm.requestID,
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
