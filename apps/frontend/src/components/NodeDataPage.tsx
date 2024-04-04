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

export interface NodeRow {
  id: string;
  xcoord: number;
  ycoord: number;
  longName: string;
}

const NodeDataPage: React.FC = () => {
  const [rows, setRows] = useState<NodeRow[]>([]);
  useEffect(() => {
    async function fetchData() {
      const res = await axios.get("/api/nodes");

      console.log(res.data);
      console.log("successfully got data from get request");
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
            <TableCell align="center">longName</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell align="right">{row.id}</TableCell>
              <TableCell align="right">{row.xcoord}</TableCell>
              <TableCell align="right">{row.ycoord}</TableCell>
              <TableCell align="right">{row.longName}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default NodeDataPage;
