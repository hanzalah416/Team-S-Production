import React, { useEffect, useState } from "react";
import axios from "axios";
import { ServiceRequestDisplay } from "./AllServiceRequestsTable.tsx";
import { allRequestForm } from "../../common/allRequestForm.ts";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import styles from "./DisplaySRData.module.css";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.common.black,
    fontWeight: "bold",
    textAlign: "center",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

export function ServiceRequestGetter() {
  const [allRequestData, setAllRequestData] = useState<allRequestForm[]>([]);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    async function fetchData() {
      const res = await axios.get("/api/all-requests");
      setAllRequestData(res.data);
      console.log(res.data);
      console.log("successfully got data from get request");
    }
    fetchData().then();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  // Filter the data based on searchValue
  const filteredAllRequestData = allRequestData.filter((request) =>
    request.name.toLowerCase().includes(searchValue.toLowerCase()),
  );

  // Sort the filtered data by requestID before rendering
  const sortedFilteredData = [...filteredAllRequestData].sort(
    (a, b) => a.requestID - b.requestID,
  );

  const updateAllRequestStatus = async (
    requestID: number,
    newStatus: string,
  ) => {
    try {
      await axios.patch(`/api/all-requests/${requestID}`, {
        status: newStatus,
      });
      setAllRequestData((prevData) =>
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

  return (
    <div className="flex flex-col gap-5">
      <TextField
        label="Filter by Name"
        value={searchValue}
        onChange={handleSearchChange}
        placeholder="Enter name..."
        variant="outlined"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      <div className={styles.tabsContainer}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Requester ID</StyledTableCell>
                <StyledTableCell align="center">Employee</StyledTableCell>
                <StyledTableCell align="center">Priority</StyledTableCell>
                <StyledTableCell align="center">Location</StyledTableCell>
                <StyledTableCell align="center">
                  Type of Request
                </StyledTableCell>
                <StyledTableCell align="center">Status</StyledTableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {sortedFilteredData.map((allRequestForm) => (
                <ServiceRequestDisplay
                  key={allRequestForm.requestID}
                  allRequestForm={allRequestForm}
                  onUpdateStatus={(newStatus) =>
                    updateAllRequestStatus(allRequestForm.requestID, newStatus)
                  }
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}
