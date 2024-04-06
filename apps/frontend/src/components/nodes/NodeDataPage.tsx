//import * as React from 'react';\
import styles from "./NodeDataPage.module.css";
import React, { useEffect, useState } from "react";
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
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import axios from "axios";
import { Node } from "database";
import { NodeEdge } from "database";

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

async function GetNodeDataFromClick() {
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

async function GetEdgeDataFromClick() {
  try {
    const res = await axios.get("/api/nodeEdge");
    console.log(res.data);
    console.log("successfully got data from get request");

    const csvString = convertToCSV(res.data); // Assuming res.data is of the type Array<{ [key: string]: number | string } you might need to change this>
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const downloadUrl = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = "Edge.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error("Error fetching or downloading CSV", error);
  }
}

const NodeDataPage: React.FC = () => {
  const [nodeRows, setNodeRows] = useState<Node[]>([]);
  const [edgeRows, setEdgeRows] = useState<NodeEdge[]>([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const nodeRes = await axios.get("/api/csv");
        console.log("successfully got node data from get request:");
        console.log(nodeRes.data);
        setNodeRows(nodeRes.data);
        //figure out how to handle setRows for Edge data
      } catch (error) {
        console.error("Error fetching node data", error);
      }
      try {
        const edgeRes = await axios.get("/api/nodeEdge");
        console.log("successfully got Edge data from get request:");
        console.log(edgeRes.data);
        setEdgeRows(edgeRes.data);
        //figure out how to handle setRows for Edge data
      } catch (error) {
        console.error("Error fetching Edge data", error);
      }
    }
    fetchData().then();
  }, []);

  const [value, setValue] = React.useState("1");
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <div className={styles.outerDiv}>
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList
              onChange={handleChange}
              aria-label="lab API tabs example"
              centered
            >
              <Tab label="Nodes" value="1" />
              <Tab label="Edges" value="2" />
            </TabList>
          </Box>
          <TabPanel value="1" style={{ padding: 0 }}>
            <div className={styles.nodeCSV}>
              <Button
                className={styles.ufileButton}
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
                style={{
                  marginRight: "5px",
                  backgroundColor: "#003b9c",
                  fontFamily: "Poppins",
                  fontSize: 14,
                  textAlign: "center",
                }}
              >
                Upload Nodes
                <VisuallyHiddenInput type="file" />
              </Button>
              <Button
                className={styles.dfileButton}
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudDownloadIcon />}
                style={{
                  marginLeft: "5px",
                  backgroundColor: "#003b9c",
                  fontFamily: "Poppins",
                  fontSize: 14,
                  textAlign: "center",
                }}
                onClick={GetNodeDataFromClick}
              >
                Download Nodes
              </Button>
            </div>
            <TableContainer component={Paper} style={{ marginTop: "25px" }}>
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
                  {nodeRows.map((row) => (
                    <TableRow
                      key={row.nodeID}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell align="center">{row.nodeID}</TableCell>
                      <TableCell align="center">{row.xcoord}</TableCell>
                      <TableCell align="center">{row.ycoord}</TableCell>
                      <TableCell align="center">{row.floor}</TableCell>
                      <TableCell align="center">{row.building}</TableCell>
                      <TableCell align="center">{row.nodeType}</TableCell>
                      <TableCell align="center">{row.longName}</TableCell>
                      <TableCell align="center">{row.shortName}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
          <TabPanel value="2" style={{ padding: 0 }}>
            <div className={styles.nodeCSV}>
              <Button
                className={styles.ufileButton}
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
                style={{
                  marginRight: "5px",
                  backgroundColor: "#003b9c",
                  fontFamily: "Poppins",
                  fontSize: 14,
                  textAlign: "center",
                }}
              >
                Upload Edges
                <VisuallyHiddenInput type="file" />
              </Button>
              <Button
                className={styles.dfileButton}
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudDownloadIcon />}
                style={{
                  marginLeft: "5px",
                  backgroundColor: "#003b9c",
                  fontFamily: "Poppins",
                  fontSize: 14,
                  textAlign: "center",
                }}
                onClick={GetEdgeDataFromClick}
              >
                Download Edges
              </Button>
            </div>
            <TableContainer component={Paper} style={{ marginTop: "25px" }}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">startNodeID</TableCell>
                    <TableCell align="center">endNodeID</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {edgeRows.map((row) => (
                    <TableRow
                      key={row.startNodeID}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell align="center">{row.startNodeID}</TableCell>
                      <TableCell align="center">{row.endNodeID}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
        </TabContext>
      </Box>
    </div>
  );
};

export default NodeDataPage;