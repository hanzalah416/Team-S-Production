import React from "react";
import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

export function ServiceRequestDisplay(props: {
  flowerform: {
    orderNumber: number;
    nameRequester: string;
    priority: string;
    location: string;
    typeFlower: string;
    customMessage: string;
    status: string;
  };
  onUpdateStatus: (newStatus: string) => void;
}) {
  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    props.onUpdateStatus(event.target.value);
  };

  return (
    <TableRow>
      <StyledTableCell>{props.flowerform.nameRequester}</StyledTableCell>
      <StyledTableCell>{props.flowerform.priority}</StyledTableCell>
      <StyledTableCell align="right">
        {props.flowerform.location}
      </StyledTableCell>
      <StyledTableCell align="right">
        {props.flowerform.typeFlower}
      </StyledTableCell>
      <StyledTableCell align="right">
        {props.flowerform.customMessage}
      </StyledTableCell>
      <StyledTableCell align="right">
        <Select
          value={props.flowerform.status}
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
    </TableRow>
  );
}
