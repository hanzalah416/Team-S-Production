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

export function MedicineDeliveryDisplay(props: {
  MedicineDeliveryForm: {
    requestID: number;
    name: string;
    priority: string;
    location: string;
    requestType: string;
    status: string;
    MedicineRequests: {
      MedicineNumber: number;
      typeMedicine: string;
      nameMedicine: string;
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
        {props.MedicineDeliveryForm.requestID}
      </StyledTableCell>
      <StyledTableCell align="center">
        {props.MedicineDeliveryForm.name}
      </StyledTableCell>
      <StyledTableCell align="center">
        {props.MedicineDeliveryForm.priority}
      </StyledTableCell>
      <StyledTableCell align="center">
        {props.MedicineDeliveryForm.location}
      </StyledTableCell>
      <StyledTableCell align="center">
        <Select
          value={props.MedicineDeliveryForm.status}
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
        {props.MedicineDeliveryForm.MedicineRequests.nameMedicine}
      </StyledTableCell>
      <StyledTableCell align="center">
        {props.MedicineDeliveryForm.MedicineRequests.typeMedicine}
      </StyledTableCell>
    </TableRow>
  );
}
