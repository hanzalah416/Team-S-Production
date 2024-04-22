import React, { useEffect, useState } from "react";
import axios from "axios";
import { LanguageRequestForm } from "../../common/LanguageRequestForm.ts";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";



const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.white,
        color: theme.palette.common.black,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

export function LanguageRequestGetter() {
    const [LanguageRequestData, setLanguageRequestData] = useState<LanguageRequestForm[]>([]);

    useEffect(() => {
        async function fetchData() {
            const res = await axios.get("/api/all-requests");
            setLanguageRequestData(res.data);
            console.log(res.data);
            console.log("successfully got data from get request");
        }
        fetchData().then();
    }, []);

    // Function to update the status of all requests
    const updateLanguageRequestStatus = async (
        requestID: number,
        newStatus: string,
    ) => {
        try {
            await axios.patch(`/api/all-requests/${requestID}`, {
                status: newStatus,
            });
            setLanguageRequestData((prevData) =>
                prevData.map((request) =>
                    request.requestID === requestID
                        ? { ...request, status: newStatus }
                        : request,
                ),
            );
        } catch (error) {
            console.error("Error updating all request status:", error);
        }
    };

    // Sort the data by orderNumber before rendering
    const sortedLanguageRequestData = [...LanguageRequestData].sort(
        (a, b) => a.requestID - b.requestID,
    );

    return (
        <div className="flex flex-col gap-5">
            <header>Service Request Data</header>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Requester ID</StyledTableCell>
                            <StyledTableCell align="right">Requester's Name</StyledTableCell>
                            <StyledTableCell align="right">Priority</StyledTableCell>
                            <StyledTableCell align="right">Location</StyledTableCell>
                            <StyledTableCell align="right">Type of Request</StyledTableCell>
                            <StyledTableCell align="right">Status</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedLanguageRequestData.map((LanguageRequestForm) => (

                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}
