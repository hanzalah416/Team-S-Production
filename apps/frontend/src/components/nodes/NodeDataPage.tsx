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
import { Node } from "../../../../../packages/database";
import { NodeEdge } from "../../../../../packages/database";
import { Employees } from "../../../../../packages/database";
import { parse } from "papaparse";
//import { nodes } from "./common/nodes.ts"; // Import papaparse for CSV parsing

const storageKey = "SelectedTab";

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
  csvRow: Array<{ [key: string]: number | string }>,
): string {
  if (csvRow.length === 0) {
    return "";
  }
  const headers = Object.keys(csvRow[0]).join(",") + "\n";
  const rows = csvRow
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

async function GetDataFromClick(type: Type) {
  try {
    console.log(`Trying to get data from "/api/${apiURL[type]}"`);
    const res = await axios.get(`/api/${apiURL[type]}`);
    console.log(res.data);
    console.log(`successfully got ${type} data from get request`);

    const csvString = convertToCSV(res.data); // Assuming res.data is of the type Array<{ [key: string]: number | string } you might need to change this>
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const downloadUrl = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = `${type}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error(`Error fetching or downloading ${type} CSV`, error);
  }
}

let csvData: string[][];

async function PostData(type: Type) {
  try {
    //const url: string = apiURL.type;
    await axios.post(`/api/${apiURL[type]}`, csvData);
    console.log(`${type} data sent`);
  } catch (error) {
    console.log(`error with sending ${type} data`);
  }
}

enum Type {
  node = "node",
  edge = "edge",
  employee = "employee",
}
interface StringStringKVP {
  [key: string]: string;
}
const apiURL: StringStringKVP = {
  [Type.node]: "csv",
  [Type.edge]: "nodeEdge",
  [Type.employee]: "employee-csv", //TBD
};

const handleFileUpload = (
  event: React.ChangeEvent<HTMLInputElement>,
  type: Type,
): void => {
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
            if (type == "node") {
              if (header === "nodeID") {
                return value !== undefined ? String(value) : ""; // Ensure nodeID is parsed as a string
              }
              return value;
            } else if (type == "edge") {
              if (header === "edgeID") {
                return value !== undefined ? String(value) : ""; // Ensure edgeID is parsed as a string
              }
              return value;
            } else if (type == "employee") {
              if (header === "employeeID") {
                return value !== undefined ? String(value) : ""; // Ensure nodeID is parsed as a string
              }
              return value;
            }
          },
        });
        if (result.data) {
          // Log the parsed CSV data
          csvData = result.data as string[][];
          let val: string;
          result.data.forEach((row, index) => {
            console.log(`${row} at ${index}`);
            if (type == Type.employee) {
              const thisRow = result.data[index] as Employees;
              console.log(thisRow.employeeID);
              val = thisRow.employeeID;
            } else if (type == Type.node) {
              const thisRow = result.data[index] as Node;
              console.log(thisRow.nodeID);
              val = thisRow.nodeID;
            } else if (type == Type.edge) {
              const thisRow = result.data[index] as NodeEdge;
              console.log(thisRow.edgeID);
              val = thisRow.edgeID;
            }
            if (val == null) {
              csvData.splice(index, 1);
            }
          });
          console.log("result.data:");
          console.log(result.data);
          console.log("csvData:");
          console.log(csvData);
          //console.log(convertCSVtoStringArrays(csvData));
          PostData(type).then();
        }
      }
    };
    reader.readAsText(file);
  }
  window.location.reload();
};

const NodeDataPage: React.FC = () => {
  const [nodeRows, setNodeRows] = useState<Node[]>([]);
  const [edgeRows, setEdgeRows] = useState<NodeEdge[]>([]);
  const [employeeRows, setEmployeeRows] = useState<Employees[]>([]);

  useEffect(() => {
    async function fetchData(type: Type) {
      try {
        const res = await axios.get(`/api/${apiURL[type]}`);
        console.log(`successfully got ${type} data from get request:`);
        console.log(res.data);
        if (type == Type.edge) {
          const edgeData: NodeEdge[] = res.data;
          const filteredEdge = edgeData.filter((x) => x.startNode != null);
          setEdgeRows(filteredEdge);
        } else if (type == Type.node) {
          setNodeRows(res.data);
        } else if (type == Type.employee) {
          setEmployeeRows(res.data);
        }
      } catch (error) {
        console.error("Error fetching Edge data", error);
      }
    }

    fetchData(Type.node).then(() => {
      fetchData(Type.edge).then(() => {
        fetchData(Type.employee).then();
      });
    });
    const storedValue = localStorage.getItem(storageKey);
    if (storedValue) {
      setValue(storedValue);
    }
  }, []);
  const [value, setValue] = React.useState("1");
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    localStorage.setItem(storageKey, newValue);
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
              <Tab label="Employees" value="3" />
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
                <VisuallyHiddenInput
                  type="file"
                  onChange={(e) => handleFileUpload(e, Type.node)}
                />
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
                onClick={() => GetDataFromClick(Type.node)}
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
                <VisuallyHiddenInput
                  type="file"
                  onChange={(e) => handleFileUpload(e, Type.edge)}
                />
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
                onClick={() => GetDataFromClick(Type.edge)}
              >
                Download Edges
              </Button>
            </div>
            <TableContainer component={Paper} style={{ marginTop: "25px" }}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">edgeID</TableCell>
                    <TableCell align="center">startNode</TableCell>
                    <TableCell align="center">endNode</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {edgeRows.map((row) => (
                    <TableRow>
                      <TableCell align="center">{row.edgeID}</TableCell>
                      <TableCell align="center">{row.startNode}</TableCell>
                      <TableCell align="center">{row.endNode}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
          <TabPanel value="3" style={{ padding: 0 }}>
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
                Upload Employees
                <VisuallyHiddenInput
                  type="file"
                  onChange={(e) => handleFileUpload(e, Type.employee)}
                />
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
                onClick={() => GetDataFromClick(Type.employee)}
              >
                Download Employees
              </Button>
            </div>
            <TableContainer component={Paper} style={{ marginTop: "25px" }}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">employeeID</TableCell>
                    <TableCell align="center">employeeName</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {employeeRows.map((row) => (
                    <TableRow>
                      <TableCell align="center">{row.employeeID}</TableCell>
                      <TableCell align="center">{row.employeeName}</TableCell>
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
