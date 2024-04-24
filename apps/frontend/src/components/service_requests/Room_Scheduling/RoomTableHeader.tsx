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
import { RoomSchedulingForm } from "./RoomSchedulingForm.ts";
import { RoomSchedulingDisplay } from "./RoomTable.tsx";

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

export default function SanitationGetter() {
  const [RoomSchedulingData, setRoomSchedulingData] = useState<
    RoomSchedulingForm[]
  >([]);

  useEffect(() => {
    async function fetchData() {
      const res = await axios.get("/api/room-scheduling");
      setRoomSchedulingData(res.data);
      console.log(res.data);
      console.log("successfully got data from get request");
    }
    fetchData().then();
  }, []);

  // Function to update the status of all requests
  const updateRoomSchedulingStatus = async (
    requestID: number,
    newStatus: string,
  ) => {
    try {
      await axios.patch(`/api/all-requests/${requestID}`, {
        status: newStatus,
      });
      setRoomSchedulingData((prevData) =>
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
  const sortedRoomData = [...RoomSchedulingData].sort(
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
            <StyledTableCell align="center">Sart Time</StyledTableCell>
            <StyledTableCell align="center">End Time</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedRoomData.map((RoomSchedulingForm) => (
            <RoomSchedulingDisplay
              key={RoomSchedulingForm.requestID}
              RoomForm={RoomSchedulingForm}
              onUpdateStatus={(newStatus) =>
                updateRoomSchedulingStatus(
                  RoomSchedulingForm.requestID,
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
