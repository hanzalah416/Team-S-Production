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

export function LangRequestDisplay(props: {
  langRequestForm: {
    requestID: number;
    name: string;
    priority: string;
    location: string;
    requestType: string;
    status: string;
    LanguageRequest: {
      orderNumber: number;
      language: string;
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
        {props.langRequestForm.requestID}
      </StyledTableCell>
      <StyledTableCell align="center">
        {props.langRequestForm.name}
      </StyledTableCell>
      <StyledTableCell align="center">
        {props.langRequestForm.priority}
      </StyledTableCell>
      <StyledTableCell align="center">
        {props.langRequestForm.location}
      </StyledTableCell>
      <StyledTableCell align="center">
        <Select
          value={props.langRequestForm.status}
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
      {/*<StyledTableCell align="right">*/}
      {/*  {props.langRequestForm.LanguageRequest.orderNumber}*/}
      {/*</StyledTableCell>*/}
      <StyledTableCell align="center">
        {props.langRequestForm.LanguageRequest.language}
      </StyledTableCell>
    </TableRow>
  );
}
