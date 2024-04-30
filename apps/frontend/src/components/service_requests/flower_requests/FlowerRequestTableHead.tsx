import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
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
import { FlowerRequestDisplay } from "./FlowerRequestTable.tsx";
import styles from "../all_requests/DisplaySRData.module.css";

interface FlowerDetails {
  orderNumber: number;
  typeFlower: string;
  customMessage: string;
}

export interface FlowerRequestForm {
  requestID: number;
  name: string;
  priority: string;
  location: string;
  requestType: string;
  status: string;
  FlowerRequests: FlowerDetails;
}

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

export default function FlowerRequestGetter() {
  const [FlowerRequestData, setFlowerRequestData] = useState<
    FlowerRequestForm[]
  >([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("name");

  useEffect(() => {
    async function fetchData() {
      const res = await axios.get("/api/flower-request");
      setFlowerRequestData(res.data || []);
    }
    fetchData().catch(console.error);
  }, []);

  const filterOptions = [
    { key: "name", label: "Requester's Name" },
    { key: "priority", label: "Priority" },
    { key: "location", label: "Location" },
    { key: "status", label: "Status" },
    { key: "FlowerRequests.typeFlower", label: "Flower Type" },
    { key: "FlowerRequests.customMessage", label: "Custom Message" },
  ];

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleFilterChange = (event: SelectChangeEvent<string>) => {
    setSelectedFilter(event.target.value);
  };

  function getNestedValue<T>(obj: T, path: string): string | undefined {
    const parts = path.split(".");
    const reducer = (acc: never, part: string) => acc && acc[part];
    // @ts-expect-error wdadwadwa
    const value = parts.reduce(reducer, obj);
    return value ? String(value) : undefined;
  }

  const onUpdateStatus = useCallback(
    (requestID: number) => (newStatus: string) => {
      const updatedData = FlowerRequestData.map((request) =>
        request.requestID === requestID
          ? { ...request, status: newStatus }
          : request,
      );
      setFlowerRequestData(updatedData);
    },
    [FlowerRequestData],
  );

  const filteredData = FlowerRequestData.sort((a, b) => {
    const fieldA = (getNestedValue(a, selectedFilter) || "")
      .toString()
      .toLowerCase();
    const fieldB = (getNestedValue(b, selectedFilter) || "")
      .toString()
      .toLowerCase();
    return fieldA.localeCompare(fieldB);
  }).filter((item) =>
    getNestedValue(item, selectedFilter)
      ?.toString()
      .toLowerCase()
      .includes(searchValue.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-5 mr-5">
      <div className="flex flex-row gap-5">
        <TextField
          label={`Filter by ${filterOptions.find((option) => option.key === selectedFilter)?.label}`}
          value={searchValue}
          onChange={handleSearchChange}
          variant="outlined"
          sx={{
            minWidth: "82%",
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <FormControl
          sx={{
            minWidth: "18%",
          }}
        >
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
                <StyledTableCell align="center">Request ID</StyledTableCell>
                <StyledTableCell align="center">
                  Requester's Name
                </StyledTableCell>
                <StyledTableCell align="center">Priority</StyledTableCell>
                <StyledTableCell align="center">Location</StyledTableCell>
                <StyledTableCell align="center">Status</StyledTableCell>
                <StyledTableCell align="center">Flower Type</StyledTableCell>
                <StyledTableCell align="center">Custom Message</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((request) => (
                <FlowerRequestDisplay
                  key={request.requestID}
                  FlowerRequestForm={request}
                  onUpdateStatus={onUpdateStatus(request.requestID)}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}
