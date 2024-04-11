import React, { useEffect, useState } from "react";
import axios from "axios";
import { FlowerRequestDisplay } from "./FlowerRequestDisplay.tsx";
import { flowerform } from "../common/flowerform.ts";
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

export function FlowerRequestGetter() {
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

  // Sort the data by orderNumber before rendering
  const sortedFlowerRequestData = [...flowerRequestData].sort(
    (a, b) => a.orderNumber - b.orderNumber,
  );

  return (
    <div className="flex flex-colgap-5">
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Patient Name</StyledTableCell>
              <StyledTableCell align="right">Patient Room</StyledTableCell>
              <StyledTableCell align="right">Custom Message</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedFlowerRequestData.map((flowerform) => (
              <FlowerRequestDisplay
                key={flowerform.orderNumber}
                flowerform={flowerform}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
