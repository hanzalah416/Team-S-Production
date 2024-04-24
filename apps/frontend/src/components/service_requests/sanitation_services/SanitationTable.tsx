import React from "react";
import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.common.black,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

export function SanitationDisplay(props: {
  SanitationForm: {
    requestID: number;
    name: string;
    priority: string;
    location: string;
    requestType: string;
    status: string;
    SanitationRequest: {
      orderNumber: number;
      sanitationType: string;
      permission: string;
    };
  };
  onUpdateStatus: (newStatus: string) => void;
}) {
  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    props.onUpdateStatus(event.target.value);
  };

  return (
    <TableRow>
      <StyledTableCell align="center">
        {props.SanitationForm.requestID}
      </StyledTableCell>
      <StyledTableCell align="center">
        {props.SanitationForm.name}
      </StyledTableCell>
      <StyledTableCell align="center">
        {props.SanitationForm.priority}
      </StyledTableCell>
      <StyledTableCell align="center">
        {props.SanitationForm.location}
      </StyledTableCell>
      <StyledTableCell align="center">
        <Select
          value={props.SanitationForm.status}
          onChange={handleStatusChange}
          displayEmpty
          inputProps={{ "aria-label": "Without label" }}
          size="small"
          sx={{ m: 1, minWidth: 120 }}
        >
          <MenuItem value={"unassigned"}>Unassigned</MenuItem>
          <MenuItem value={"assigned"}>Assigned</MenuItem>
          <MenuItem value={"in_progress"}>In Progress</MenuItem>
          <MenuItem value={"closed"}>Closed</MenuItem>
        </Select>
      </StyledTableCell>
      <StyledTableCell align="center">
        {props.SanitationForm.SanitationRequest.sanitationType}
      </StyledTableCell>
      <StyledTableCell align="center">
        {props.SanitationForm.SanitationRequest.permission}
      </StyledTableCell>
    </TableRow>
  );
}
