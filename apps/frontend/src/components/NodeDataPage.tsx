//import * as React from 'react';\
import styles from './NodeDataPage.module.css';
import React, { useEffect, useState } from "react";
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import axios from "axios";
import { Node } from "../../../../packages/database/.prisma/client";

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

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

    const [value, setValue] = React.useState('1');
    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

  return (
      <div className={styles.outerDiv}>

          <Box sx={{ width: '100%', typography: 'body1' }}>
              <TabContext value={value}>
                  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                      <TabList onChange={handleChange} aria-label="lab API tabs example" centered>
                          <Tab label="Nodes" value="1" />
                          <Tab label="Edges" value="2" />
                      </TabList>
                  </Box>
                  <TabPanel value="1" style={{padding: 0 }}>
                      <div className={styles.nodeCSV}>
                          { /* <h2>Import / Export Nodes</h2> */}
                              <Button
                                  className={styles.ufileButton}
                                  component="label"
                                  role={undefined}
                                  variant="contained"
                                  tabIndex={-1}
                                  startIcon={<CloudUploadIcon/>}
                                  style={{
                                      marginRight: "5px",
                                      backgroundColor: "#003b9c",
                                      fontFamily: "Poppins",
                                      fontSize: 14,
                                      textAlign: "center",
                                  }}>Import Nodes<VisuallyHiddenInput type="file"/>
                              </Button>
                              <Button
                                  className={styles.dfileButton}
                                  component="label"
                                  role={undefined}
                                  variant="contained"
                                  tabIndex={-1}
                                  startIcon={<CloudDownloadIcon/>}
                                  style={{
                                      marginLeft: "5px",
                                      backgroundColor: "#003b9c",
                                      fontFamily: "Poppins",
                                      fontSize: 14,
                                      textAlign: "center",
                                  }}>Export Nodes<VisuallyHiddenInput type="file"/>
                              </Button>
                      </div>
                          <TableContainer component={Paper} style={{marginTop: "75px"}}>
                              <Table sx={{minWidth: 650}} aria-label="simple table">
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
                                              sx={{"&:last-child td, &:last-child th": {border: 0}}}
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
                  </TabPanel>
                  <TabPanel value="2" style={{padding: 0}}>
                      <div className={styles.nodeCSV}>
                          { /* <h2>Import / Export Nodes</h2> */}
                              <Button
                                  className={styles.ufileButton}
                                  component="label"
                                  role={undefined}
                                  variant="contained"
                                  tabIndex={-1}
                                  startIcon={<CloudUploadIcon/>}
                                  style={{
                                      marginRight: "5px",
                                      backgroundColor: "#003b9c",
                                      fontFamily: "Poppins",
                                      fontSize: 14,
                                      textAlign: "center",
                                  }}>Import Edges<VisuallyHiddenInput type="file"/>
                              </Button>
                              <Button
                                  className={styles.dfileButton}
                                  component="label"
                                  role={undefined}
                                  variant="contained"
                                  tabIndex={-1}
                                  startIcon={<CloudDownloadIcon/>}
                                  style={{
                                      marginLeft: "5px",
                                      backgroundColor: "#003b9c",
                                      fontFamily: "Poppins",
                                      fontSize: 14,
                                      textAlign: "center",
                                  }}>Export Edges<VisuallyHiddenInput type="file"/>
                              </Button>
                      </div>
                  </TabPanel>
              </TabContext>
          </Box>

      </div>
  );
};

export default NodeDataPage;
