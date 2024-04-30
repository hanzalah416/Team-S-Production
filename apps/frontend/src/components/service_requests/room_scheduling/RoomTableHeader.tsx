import React, { useEffect, useState, useCallback } from "react";
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
import { RoomSchedulingDisplay } from "./RoomTable.tsx";
import styles from "../all_requests/DisplaySRData.module.css";
import MenuItem from "@mui/material/MenuItem";

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

export default function RoomSchedulingGetter() {
  const [roomSchedulingData, setRoomSchedulingData] = useState<
    RoomSchedulingForm[]
  >([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("name");

  useEffect(() => {
    async function fetchData() {
      const res = await axios.get("/api/room-scheduling");
      setRoomSchedulingData(res.data || []);
      console.log(res.data);
      console.log("successfully got data from get request");
    }
    fetchData().then();
  }, []);

  const filterOptions = [
    { key: "name", label: "Requester's Name" },
    { key: "priority", label: "Priority" },
    { key: "location", label: "Location" },
    { key: "status", label: "Status" },
    { key: "RoomScheduling.startTime", label: "Start Time" },
    { key: "RoomScheduling.endTime", label: "End Time" },
  ];

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleFilterChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedFilter(event.target.value as string);
  };

  const getNestedValue = <T extends Record<string, unknown>>(
    obj: T,
    path: string,
  ): string | undefined => {
    const parts = path.split(".");
    const reducer = (acc: never, part: string) => acc && acc[part];
    // @ts-expect-error wdadwadwa
    const value = parts.reduce(reducer, obj as RoomSchedulingForm);
    return value ? String(value) : undefined;
  };

  const filteredData = roomSchedulingData
    .filter((item) =>
      getNestedValue(item, selectedFilter)
        ?.toString()
        .toLowerCase()
        .includes(searchValue.toLowerCase()),
    )
    .sort((a, b) => {
      const fieldA = (getNestedValue(a, selectedFilter) || "")
        .toString()
        .toLowerCase();
      const fieldB = (getNestedValue(b, selectedFilter) || "")
        .toString()
        .toLowerCase();
      return fieldA.localeCompare(fieldB);
    });
  const onUpdateStatus = useCallback(
    (requestID: number) => async (newStatus: string) => {
      try {
        await axios.patch(`/api/all-requests/${requestID}`, {
          status: newStatus,
        });
        setRoomSchedulingData((prevData) =>
          prevData.map((request) =>
            request.requestID === requestID
              ? { ...request, status: newStatus }
              : request,
          ),
        );
      } catch (error) {
        console.error("Error updating all request status:", error);
      }
    },
    [],
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-row gap-5">
        <TextField
          label={`Filter by ${
            filterOptions.find((option) => option.key === selectedFilter)?.label
          }`}
          value={searchValue}
          onChange={handleSearchChange}
          variant="outlined"
          sx={{
            minWidth: "80%",
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          select
          value={selectedFilter}
          onChange={handleFilterChange}
          variant="outlined"
          sx={{
            minWidth: "18%",
          }}
        >
          {filterOptions.map((option) => (
            <MenuItem key={option.key} value={option.key}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
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
                <StyledTableCell align="center">Start Time</StyledTableCell>
                <StyledTableCell align="center">End Time</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((roomSchedulingForm) => (
                <RoomSchedulingDisplay
                  key={roomSchedulingForm.requestID}
                  RoomForm={roomSchedulingForm} // Change 'roomForm' to 'RoomForm'
                  onUpdateStatus={onUpdateStatus(roomSchedulingForm.requestID)}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

export type RoomSchedulingForm = {
  requestID: number;
  name: string;
  priority: string;
  location: string;
  requestType: string;
  status: string;
  RoomScheduling: {
    requestNumber: number;
    startTime: string;
    endTime: string;
  };
};
