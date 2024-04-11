import * as React from "react";
import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";

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
    patientName: string;
    PatientRoom: number;
    customMessage: string;
    status: string;
    orderNumber: number;
  };
    onUpdateStatus: (newStatus: string) => void;
}){
    const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        props.onUpdateStatus(event.target.value);
    };
  return (
      <TableRow>
          <StyledTableCell>Flower Request</StyledTableCell>
          <StyledTableCell align="right">
              {props.flowerform.customMessage}
          </StyledTableCell>
          <StyledTableCell align="right">
              Patient Room: {props.flowerform.PatientRoom}
          </StyledTableCell>
          <StyledTableCell align="right">
              {props.flowerform.orderNumber}
          </StyledTableCell>
          <select value={props.flowerform.status} onChange={handleStatusChange}>
              <option value="unassigned">Unassigned</option>
              <option value="assigned">Assigned</option>
              <option value="in_progress">In Progress</option>
              <option value="closed">Closed</option>
          </select>
      </TableRow>
  );
}
