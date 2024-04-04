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

/*function createData(
    name: string,
    calories: number,
    fat: number,
    carbs: number,
    protein: number,
) {
  return { name, calories, fat, carbs, protein };
}*/

export function FlowerRequestDisplay(props: {
  flowerform: {
    patientName: string;
    PatientRoom: number;
    customMessage: string;
  };
}) {
  return (
    <TableRow>
      <StyledTableCell>{props.flowerform.patientName}</StyledTableCell>
      <StyledTableCell align="right">
        {props.flowerform.PatientRoom}
      </StyledTableCell>
      <StyledTableCell align="right">
        {props.flowerform.customMessage}
      </StyledTableCell>
    </TableRow>
  );
}
