import React, { useEffect, useState } from "react";
import axios from "axios";
import { ServiceRequestDisplay } from "./AllServiceRequestsTable.tsx";
import { flowerform } from "../../common/flowerform.ts";
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
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

export function ServiceRequestGetter() {
  const [flowerRequestData, setFlowerRequestData] = useState<flowerform[]>([]);

  useEffect(() => {
    async function fetchData() {
      const res = await axios.get("/api/flower-request");
      setFlowerRequestData(res.data);
      console.log(res.data);
      console.log("successfully got data from get request");
    }
    fetchData().then();
  }, []);

  // Function to update the status of a flower request
  const updateFlowerRequestStatus = async (
    orderNumber: number,
    newStatus: string,
  ) => {
    try {
      await axios.patch(`/api/flower-request/${orderNumber}`, {
        status: newStatus,
      });
      setFlowerRequestData((prevData) =>
        prevData.map((request) =>
          request.orderNumber === orderNumber
            ? { ...request, status: newStatus }
            : request,
        ),
      );
    } catch (error) {
      console.error("Error updating flower request status:", error);
    }
  };

  // Sort the data by orderNumber before rendering
  const sortedFlowerRequestData = [...flowerRequestData].sort(
    (a, b) => a.orderNumber - b.orderNumber,
  );

  return (
    <div className="flex flex-col gap-5">
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Request Type</StyledTableCell>
              <StyledTableCell align="right">Comment</StyledTableCell>
              <StyledTableCell align="right">Misc Info</StyledTableCell>
              <StyledTableCell align="right">ID Number</StyledTableCell>
              <StyledTableCell align="right">Status</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedFlowerRequestData.map((flowerform) => (
              <ServiceRequestDisplay
                key={flowerform.orderNumber}
                flowerform={flowerform}
                onUpdateStatus={(newStatus) =>
                  updateFlowerRequestStatus(flowerform.orderNumber, newStatus)
                }
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
