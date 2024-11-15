/* eslint-disable react/jsx-key */
import { useTable, useSortBy, usePagination } from "react-table";
import { data } from "../assets/data.json";

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
  {
    Header: "ID",
    accessor: "id",
  },
  {
    Header: "Task Name",
    accessor: "label",
  },
  {
    Header: "Description",
    accessor: "desc",
  },
  {
    Header: "Priority",
    accessor: "priority",
    sortType: prioritySort,
  },
  {
    Header: "State",
    accessor: "state",
  },
  {
    Header: "Assignees",
    accessor: "assignees",
    Cell: ({ value }) => (
      <div style={{ border: "2px red solid" }}>
        {value.map((assignee) => assignee.first_name).join(", ")}
      </div>
    ),
  },
  {
    Header: "Project",
    accessor: "project.name",
  },
  {
    Header: "Created At",
    accessor: "created_at",
    Cell: ({ value }) => new Date(value).toLocaleDateString(),
  },
  {
    Header: "Due Date",
    accessor: "due_date",
    Cell: ({ value }) => new Date(value).toLocaleDateString(),
    sortType: dateSort,
  },
  {
    Header: "Attachment",
    accessor: "attachment",
    Cell: ({ value }) =>
      value ? (
        <a href={value} target="_blank" rel="noopener noreferrer">
          <button>View Attachment</button>
        </a>
      ) : (
        "No Attachment"
      ),
  },
];

const ReactTable = () => {
  const pageSize = 5; // Set your desired page size here
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
    <div className="container">
      <table
        {...getTableProps()}
        style={{ width: "100%", borderCollapse: "collapse" }}
      >
        <thead>
          {headerGroups.map((hg) => (
            <tr
              key={hg.getHeaderGroupProps().key}
              {...hg.getHeaderGroupProps()}
              style={{ background: "#f4f4f4" }}
            >
              {hg.headers.map((column) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  style={{ padding: "10px", border: "1px solid #ddd" }}
                >
                  {column.render("Header")}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? " 🔽"
                        : " 🔼"
                      : ""}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} style={{ textAlign: "left" }}>
                {row.cells.map((cell) => (
                  <td
                    {...cell.getCellProps()}
                    style={{ padding: "10px", border: "1px solid #ddd" }}
                  >
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div>
        <button disabled={!canPreviousPage} onClick={previousPage}>
          Prev
        </button>
        <span>{`${pageIndex + 1} / ${Math.ceil(data.length / pageSize)}`}</span>
        <button disabled={!canNextPage} onClick={nextPage}>
          Next
        </button>
      </div>
    </div>
  );
};

export default ReactTable;
