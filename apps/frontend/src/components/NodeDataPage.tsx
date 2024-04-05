import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";
import { parse } from "papaparse";
import { nodes } from "./common/nodes.ts"; // Import papaparse for CSV parsing

export interface NodeRow {
  nodeID: string;
  xcoord: number;
  ycoord: number;
  floor: string;
  building: string;
  nodeType: string;
  longName: string;
  shortName: string;
}

const NodeDataPage: React.FC = () => {
  const [rows, setRows] = useState<NodeRow[] | nodes[]>([]);
  const [csvData, setCsvData] = useState<string[][]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target) {
          const text = e.target.result as string;
          const result = parse(text, {
            header: true,
            dynamicTyping: true,
            transform: (value, header) => {
              if (header === "nodeID") {
                return value !== undefined ? String(value) : ""; // Ensure nodeID is parsed as a string
              }
              return value;
            },
          });
          if (result.data) {
            // Log the parsed CSV data
            setCsvData(result.data as string[][]);
            console.log(result.data);
          }
        }
      };
      reader.readAsText(file);
    }
  };

  useEffect(() => {
    async function fetchData() {
      const res = await axios.get("/api/all-node-data");

      console.log(res.data);
      console.log("successfully got data from get request");
      setRows(res.data);
    }
    fetchData().then();
  }, []);

  useEffect(() => {
    // Convert CSV data to NodeRow format
    const convertedData: nodes[] = csvData.map((row) => ({
      nodeID: row.nodeID,
      xcoord: parseFloat(row.xcoord),
      ycoord: parseFloat(row.ycoord),
      floor: row.floor,
      building: row.building,
      nodeType: row.nodeType,
      longName: row.longName,
      shortName: row.shortName,
    }));
    console.log(convertedData);
    convertedData.forEach((row) => {
      console.log("Row:", row);
      axios
        .post("/api/csv", row, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then(() => {
          console.log("Node sent successfully");
        })
        .catch(() => {
          console.log("Node failed to send");
        });
    }); // Log the converted data
    setRows(convertedData);
  }, [csvData]);

  return (
    <div>
      <input
        type="file"
        onChange={handleFileUpload}
        style={{ marginTop: "75px" }}
      />
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
            {rows.map((row, index) => {
              return (
                <TableRow
                  key={`${row.nodeID || index}-${row.floor}-${row.building}`}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="center">{String(row.nodeID)}</TableCell>
                  <TableCell align="center">{row.xcoord}</TableCell>
                  <TableCell align="center">{row.ycoord}</TableCell>
                  <TableCell align="center">{row.floor}</TableCell>
                  <TableCell align="center">{row.building}</TableCell>
                  <TableCell align="center">{row.nodeType}</TableCell>
                  <TableCell align="center">{row.longName}</TableCell>
                  <TableCell align="center">{row.shortName}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default NodeDataPage;
