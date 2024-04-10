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

export function SecurityRequestDisplay(props: {
  securityform: {
    staffName: string;
    location: string;
    requestStatus: string;
    requestPriority: string;
    securityType: string;
    threatType: string;
  };
}) {
  return (
    <TableRow>
      <StyledTableCell>{props.securityform.staffName}</StyledTableCell>
      <StyledTableCell>
        {props.securityform.location}
      </StyledTableCell>
      <StyledTableCell>
        {props.securityform.requestStatus}
      </StyledTableCell>
        <StyledTableCell>
            {props.securityform.requestPriority}
        </StyledTableCell>
        <StyledTableCell>
            {props.securityform.securityType}
        </StyledTableCell>
        <StyledTableCell>
            {props.securityform.threatType}
        </StyledTableCell>
    </TableRow>
  );
}
