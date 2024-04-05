//import * as React from 'react';\
import { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";
//import createCsvFile from "./WriteCSVFrontEnd";
import { Node } from "../../../../packages/database/.prisma/client";

const NodeDataPage: React.FC = () => {
  const [rows, setRows] = useState<Node[]>([]);
  useEffect(() => {
    async function fetchData() {
      const res = await axios.get("/api/csv");
      console.log(res.data);
      console.log("successfully got data from get request");

      //     try {
      //         if (Array.isArray(res.data) && res.data.length > 0) {
      //             await createCsvFile({ headers: [{ id: "nodeID", title: "title" }], data: res.data },"csv_data/FrontEndNodes.csv");
      //         } else {
      //             console.error("Invalid data received from API.");
      //         }
      //     } catch (error) {
      //         console.error("Error fetching data:", error);
      //     }
      setRows(res.data);
    }
    fetchData().then();
  }, []);
  console.log(rows);
  return (
    <TableContainer component={Paper} style={{ marginTop: "75px" }}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>nodeID(key)</TableCell>
            <TableCell align="center">xcoord</TableCell>
            <TableCell align="center">ycoord</TableCell>
            <TableCell align="center">floor</TableCell>
            <TableCell align="center">building</TableCell>
            <TableCell align="center">nodeType</TableCell>
            <TableCell align="center">longName</TableCell>
            <TableCell align="center">shortName</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.nodeID}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell align="right">{row.nodeID}</TableCell>
              <TableCell align="right">{row.xcoord}</TableCell>
              <TableCell align="right">{row.ycoord}</TableCell>
              <TableCell align="right">{row.floor}</TableCell>
              <TableCell align="right">{row.building}</TableCell>
              <TableCell align="right">{row.nodeType}</TableCell>
              <TableCell align="right">{row.longName}</TableCell>
              <TableCell align="right">{row.shortName}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default NodeDataPage;
