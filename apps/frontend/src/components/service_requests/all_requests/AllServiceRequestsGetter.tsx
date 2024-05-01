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
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
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
  const [selectedFilter, setSelectedFilter] = useState("name");

  useEffect(() => {
    async function fetchData() {
      const res = await axios.get("/api/all-requests");
      setAllRequestData(res.data || []);
    }
    fetchData().catch(console.error);
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleFilterChange = (event: SelectChangeEvent<string>) => {
    setSelectedFilter(event.target.value);
  };

  const filterOptions = [
    { key: "name", label: "Name" },
    { key: "priority", label: "Priority" },
    { key: "location", label: "Location" },
    { key: "requestType", label: "Request Type" },
    { key: "status", label: "Status" },
  ];

  // Filter and sort the data based on searchValue and selectedFilter
  const filteredAllRequestData = allRequestData.filter((request) =>
    (request[selectedFilter as keyof allRequestForm] ?? "")
      .toString()
      .toLowerCase()
      .includes(searchValue.toLowerCase()),
  );
  const sortedFilteredData = [...filteredAllRequestData].sort((a, b) => {
    const fieldA = (a[selectedFilter as keyof allRequestForm] ?? "")
      .toString()
      .toLowerCase();
    const fieldB = (b[selectedFilter as keyof allRequestForm] ?? "")
      .toString()
      .toLowerCase();
    return fieldA.localeCompare(fieldB);
  });

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
      <div className="flex flex-row gap-2" style={{ alignItems: "center" }}>
        <TextField
          label={`Filter by ${filterOptions.find((option) => option.key === selectedFilter)?.label}`}
          value={searchValue}
          onChange={handleSearchChange}
          variant="outlined"
          sx={{ flex: 8 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <FormControl sx={{ flex: 2 }}>
          <Select
            value={selectedFilter}
            onChange={handleFilterChange}
            displayEmpty
            inputProps={{ "aria-label": "Without label" }}
          >
            {filterOptions.map((option) => (
              <MenuItem key={option.key} value={option.key}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div className={styles.tabsContainer}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Requester ID</StyledTableCell>
                <StyledTableCell align="center">Name</StyledTableCell>
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
