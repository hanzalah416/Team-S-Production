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
//import CreateCSVFromDB from "../../../backend/src/DBtoCSV.ts";

// function createData(
//   nodeID: string,
//   xcoord: number,
//   ycoord: number,
//   // floor: string,
//   // building: string,
//   // nodeType: string,
//   longName: string,
//   //shortName: string,
// ) {
//   return {
//     nodeID,
//     xcoord,
//     ycoord,
//       /*
//     floor,
//     building,
//     nodeType,
//        */
//     longName,
//     //shortName,
//   };
// }

interface NodeRow {
  nodeID: string;
  xcoord: number;
  ycoord: number;
  longName: string;
}

// const rows = [
//   createData(
//     "CCONF001L1",
//     2255,
//     849,
//     "L1",
//     "45 Francis",
//     "CONF",
//     "Anesthesia Conf Floor L1",
//     "Conf C001L1",
//   ),
//   createData("Ice cream sandwich", 237, 9.0, "24", "4.0", "0", "", ""),
//   createData("Eclair", 262, 16.0, "24", "4.0", "0", "", ""),
//   createData("Cupcake", 305, 3.7, "24", "4.0", "0", "", ""),
//   createData("Gingerbread", 356, 16.0, "24", "4.0", "0", "", ""),
// ];

const NodeDataPage: React.FC = () => {
  const [rows, setRows] = useState<NodeRow[]>([]);
  useEffect(() => {
    // Run main function when the component mounts
    {
      /*CreateCSVFromDB().then(r => );*/
    }
    async function fetchData() {
      const res = await axios.get("/api/nodes");
      console.log(res.data);
      console.log("successfully got data from get request");
      setRows(res.data);
      // res.data.forEach((row: NodeRow) => {
      //     createData(row.nodeID,row.xcoord,row.ycoord,row.longName);
      //   });
    }
    fetchData().then();
  }, []);
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>nodeID(key)</TableCell>
            <TableCell align="center">xcoord</TableCell>
            <TableCell align="center">ycoord</TableCell>
            {/*<TableCell align="center">floor</TableCell>*/}
            {/*<TableCell align="center">building</TableCell>*/}
            {/*<TableCell align="center">nodeType</TableCell>*/}
            <TableCell align="center">longName</TableCell>
            {/*<TableCell align="center">shortName</TableCell>*/}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.nodeID}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.nodeID}
              </TableCell>
              <TableCell align="right">{row.xcoord}</TableCell>
              <TableCell align="right">{row.ycoord}</TableCell>
              {/*<TableCell align="right">{row.floor}</TableCell>*/}
              {/*<TableCell align="right">{row.building}</TableCell>*/}
              {/*<TableCell align="right">{row.nodeType}</TableCell>*/}
              <TableCell align="right">{row.longName}</TableCell>
              {/*<TableCell align="right">{row.shortName}</TableCell>*/}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default NodeDataPage;
