import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";
import { parse } from "papaparse"; // Import papaparse for CSV parsing

export interface NodeEdgeRow {
    startNodeID: string;
    endNodeID: string;
}

const NodeDataPage: React.FC = () => {
    const [rows, setRows] = useState<NodeEdgeRow[]>([]);
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
                        transform: (value) => {
                            return value;
                        },
                    });
                    if (result.data) {
                        setCsvData(result.data);
                        console.log("Parsed CSV Data:", result.data);

                        const convertedData: NodeEdgeRow[] = result.data.map((row) => ({
                            startNode: row.startNode,
                            endNode: row.endNode,
                        }));
                        console.log("Converted Data:", convertedData);
                        setRows(convertedData);
                    }
                }
            };
            reader.readAsText(file);
        }
    };


    useEffect(() => {
        async function fetchData() {
            const res = await axios.get("/api/all-edges-data");

            console.log(res.data);
            console.log("successfully got data from get request");
            setRows(res.data);
        }
        fetchData().then();
    }, []);

    useEffect(() => {
        const convertedData: NodeEdgeRow[] = csvData.map((row) => ({
            startNodeID: row.startNodeID,
            endNodeID: row.endNodeID,
        }));
        setRows(convertedData);
    }, [csvData]);

    return (
        <div>
            <input type="file" onChange={handleFileUpload} style={{ marginTop: "75px" }} />
            <TableContainer component={Paper} style={{ marginTop: "75px" }}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Start Node ID</TableCell>
                            <TableCell align="center">End Node ID</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, index) => {
                            return (
                                <TableRow
                                    key={`${index}-${row.startNodeID}-${row.endNodeID}`}
                                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                                >
                                    <TableCell align="center">{row.startNodeID}</TableCell>
                                    <TableCell align="center">{row.endNodeID}</TableCell>
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
