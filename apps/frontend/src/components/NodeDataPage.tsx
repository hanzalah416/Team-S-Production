//import * as React from 'react';\
import styles from "./NodeDataPage.module.css";
import { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";
import { Node } from "../../../../packages/database/.prisma/client";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

function convertToCSV(
  nodes: Array<{ [key: string]: number | string }>,
): string {
  if (nodes.length === 0) {
    return "";
  }

  const headers = Object.keys(nodes[0]).join(",") + "\n";

  const rows = nodes
    .map((node) =>
      Object.values(node)
        .map((value) => {
          if (typeof value === "string") {
            value = value.replace(/"/g, '""'); // Escape double quotes
            value = `${value}`; // Enclose the string in double quotes
          }
          return value;
        })
        .join(","),
    )
    .join("\n");

  return headers + rows;
}

async function GetDataFromClick() {
  try {
    const res = await axios.get("/api/csv");
    console.log(res.data);
    console.log("successfully got data from get request");

    const csvString = convertToCSV(res.data); // Assuming res.data is of the type Array<{ [key: string]: number | string } you might need to change this>
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const downloadUrl = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = "Nodes.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error("Error fetching or downloading CSV", error);
  }
}

// function downloadTxtFile = () =>{
//     const element = document.createElement("nodeElement");
//     const file = new Blob([document.getElementById('myInput').value], {type: 'csv/text'});
//     element.href = URL.createObjectURL(file);
//     element.download = "myFile.txt";
//     document.body.appendChild(element); // Required for this to work in FireFox
//     element.click();
// }

const NodeDataPage: React.FC = () => {
  const [rows, setRows] = useState<Node[]>([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get("/api/csv");
        console.log(res.data);
        console.log("successfully got data from get request");
        setRows(res.data);
      } catch (error) {
        console.error("Error fetching", error);
      }
    }
    fetchData().then();
  }, []);
  console.log(rows);
  return (
    <div className={styles.outerDiv}>
      <div className={styles.nodeCSV}>
        <h2>Import / Export Nodes</h2>
        <div className={styles.Butt}>
          <div className={styles.ospacer}></div>
          <Button
            className={styles.ufileButton}
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
            style={{
              backgroundColor: "#003b9c",
              fontFamily: "Poppins",
              fontSize: 14,
              textAlign: "center",
            }}
          >
            Import Nodes
            <VisuallyHiddenInput type="file" />
          </Button>
          <div className={styles.spacer}></div>
          <Button
            className={styles.dfileButton}
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudDownloadIcon />}
            style={{
              backgroundColor: "#003b9c",
              fontFamily: "Poppins",
              fontSize: 14,
              textAlign: "center",
            }}
            onClick={GetDataFromClick}
          >
            {/*<a*/}
            {/*  href="/csv_data/Nodes.csv"*/}
            {/*  download="Nodes"*/}
            {/*  style={{ color: "#fff", textDecoration: "none" }}*/}
            {/*>*/}
            {/*  Export Nodes*/}
            {/*</a>*/}
          </Button>
          <div className={styles.ospacer}></div>
        </div>
      </div>

      <div className={styles.tableDiv}>
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
      </div>
    </div>
  );
};

export default NodeDataPage;
