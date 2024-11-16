import React, { useState } from "react";
import {
  InputAdornment,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Paper,
  Button,
  IconButton,
  Typography,
} from "@mui/material";
import { useTable, useSortBy, usePagination } from "react-table";
import { data } from "../assets/data.json";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SearchIcon from "@mui/icons-material/Search";

const prioritySort = (rowA, rowB, columnId) => {
  const priorityOrder = { LOW: 1, MEDIUM: 2, HIGH: 3 };
  const a = priorityOrder[rowA.values[columnId]?.toUpperCase()] || 0;
  const b = priorityOrder[rowB.values[columnId]?.toUpperCase()] || 0;
  return a - b;
};

const dateSort = (rowA, rowB, columnId) => {
  const dateA = new Date(rowA.values[columnId]);
  const dateB = new Date(rowB.values[columnId]);
  return dateA - dateB;
};

const columns = [
  { Header: "ID", accessor: "id", width: "5%" },
  { Header: "Task Name", accessor: "label", width: "15%" },
  { Header: "Description", accessor: "desc", width: "20%" },
  {
    Header: "Priority",
    accessor: "priority",
    sortType: prioritySort,
    width: "10%",
  },
  { Header: "State", accessor: "state", width: "10%" },
  {
    Header: "Assignees",
    accessor: "assignees",
    width: "15%",
    Cell: ({ value }) =>
      value.map((assignee) => assignee.first_name).join(", "),
  },
  { Header: "Project", accessor: "project.name", width: "10%" },
  {
    Header: "Created At",
    accessor: "created_at",
    width: "10%",
    Cell: ({ value }) => new Date(value).toLocaleDateString(),
  },
  {
    Header: "Due Date",
    accessor: "due_date",
    width: "10%",
    Cell: ({ value }) => new Date(value).toLocaleDateString(),
    sortType: dateSort,
  },
  {
    Header: "Attachment",
    accessor: "attachment",
    width: "10%",
    Cell: ({ value }) =>
      value ? (
        <Button
          variant="outlined"
          color="primary"
          startIcon={<AttachFileIcon />}
          href={value}
          target="_blank"
          rel="noopener noreferrer"
        >
          View
        </Button>
      ) : (
        "No Attachment"
      ),
  },
];

const ReactTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const pageSize = 5;
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    nextPage,
    previousPage,
    canPreviousPage,
    canNextPage,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageSize },
      pageCount: Math.ceil(data.length / pageSize),
    },
    useSortBy,
    usePagination
  );

  return (
    <Paper elevation={3} style={{ padding: "20px", margin: "20px" }}>
      <Grid container spacing={2}>
        <Grid xs={12}>
          <Typography variant="h6" align="center" gutterBottom>
            Task Table
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Search"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ marginBottom: "20px", width: "100%" }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => {}}>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>
      <TableContainer>
        <Table {...getTableProps()}>
          <TableHead>
            {headerGroups.map((headerGroup) => (
              <TableRow
                {...headerGroup.getHeaderGroupProps()}
                style={{ backgroundColor: "#e0e0e0" }}
              >
                {headerGroup.headers.map((column) => (
                  <TableCell
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    style={{
                      fontWeight: "bold",
                      width: column.width,

                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    {column.render("Header")}
                    {column.isSorted ? (
                      column.isSortedDesc ? (
                        <ArrowDownwardIcon fontSize="small" />
                      ) : (
                        <ArrowUpwardIcon fontSize="small" />
                      )
                    ) : null}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody {...getTableBodyProps()}>
            {page.map((row, rowIndex) => {
              prepareRow(row);
              return (
                <TableRow
                  {...row.getRowProps()}
                  style={{
                    backgroundColor: rowIndex % 2 === 0 ? "#f9f9f9" : "#ffffff",
                  }}
                >
                  {row.cells.map((cell) => (
                    <TableCell
                      {...cell.getCellProps()}
                      style={{ width: cell.column.width }}
                    >
                      {cell.render("Cell")}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={data.length}
        page={pageIndex}
        onPageChange={(e, newPage) => {
          if (newPage > pageIndex) nextPage();
          else previousPage();
        }}
        rowsPerPage={pageSize}
        rowsPerPageOptions={[5, 10]}
        onRowsPerPageChange={() => {}}
      />
    </Paper>
  );
};

export default ReactTable;
