import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
} from "@mui/material";

import { InboxOutlined } from "@mui/icons-material";

const DataTable = ({ columns, rows }) => {
  if (!rows || rows.length === 0) {
    return (
      <TableContainer component={Paper} elevation={0}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 8,
            color: "#a0aebb",
          }}
        >
          <InboxOutlined sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
          <Typography sx={{ fontSize: "0.9rem", color: "#a0aebb" }}>No records found</Typography>
        </Box>
      </TableContainer>
    );
  }

  return (
    <TableContainer component={Paper} elevation={0}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.field}>{column.headerName}</TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index}>
              {columns.map((column) => (
                <TableCell key={column.field}>
                  {column.render ? column.render(row) : row[column.field]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DataTable;
