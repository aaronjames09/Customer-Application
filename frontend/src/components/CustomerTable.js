import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useTable, usePagination, useSortBy, useGlobalFilter } from 'react-table';
import '../assets/CustomerTable.css';

const CustomerTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [pageSize] = useState(10); // Number of records per page
  const [search, setSearch] = useState(''); // Search term

  // Fetch data for the current page
  const fetchData = async (pageIndex, sortBy) => {
    try {
      setLoading(true);
      const sortField = sortBy.length ? sortBy[0].id : '';
      const sortOrder = sortBy.length ? (sortBy[0].desc ? 'desc' : 'asc') : '';

      const result = await axios.get(`http://localhost:3001/customers`, {
        params: {
          page: pageIndex + 1,
          limit: pageSize,
          search,
          sortField,
          sortOrder
        }
      });

      if (result.data && Array.isArray(result.data.data)) {
        setData(result.data.data.map(item => ({
          ...item,
          date: new Date(item.created_at).toLocaleDateString(),
          time: new Date(item.created_at).toLocaleTimeString()
        })));
        setPageCount(Math.ceil(result.data.totalRecords / pageSize));
      } else {
        throw new Error('Data format is incorrect, expected an array in data field');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const columns = useMemo(
    () => [
      { Header: 'Serial No', accessor: 'sno' },
      { Header: 'Customer Name', accessor: 'customer_name' },
      { Header: 'Age', accessor: 'age' },
      { Header: 'Phone', accessor: 'phone' },
      { Header: 'Customer Location', accessor: 'customer_location' },
      { Header: 'Date', accessor: 'date' },
      { Header: 'Time', accessor: 'time' }
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canNextPage,
    canPreviousPage,
    pageOptions,
    state,
    gotoPage,
    nextPage,
    previousPage,
    setGlobalFilter
  } = useTable(
    {
      columns,
      data,
      manualPagination: true, // Tell the usePagination hook that we'll handle our own pagination
      manualSortBy: true, // Tell the useSortBy hook that we'll handle our own sorting
      pageCount
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const { globalFilter, pageIndex, sortBy } = state;

  useEffect(() => {
    fetchData(pageIndex, sortBy); // Fetch data whenever pageIndex, sortBy or search changes
  }, [pageIndex, sortBy, search]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <input
        value={globalFilter || ''}
        onChange={(e) => setGlobalFilter(e.target.value || undefined)}
        placeholder="Search..."
      />
     
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div>
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </button>
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>
        </span>
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </button>
      </div>
    </>
  );
};

export default CustomerTable;
