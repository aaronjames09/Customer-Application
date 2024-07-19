import React, {useMemo} from 'react'
import { useTable, useSortBy } from 'react-table';
import axios from 'axios';
import { COLUMNS } from './columns'
import './table.css'
import { VscChevronUp } from "react-icons/vsc";
import { VscChevronDown } from "react-icons/vsc";

export const SortingTable = () => {
    const columns = useMemo(() => COLUMNS, [])
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/customers');
                setData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const tableInstance = useTable({
        columns,
        data,
    },
    useSortBy)

    const { 
        getTableProps, 
        getTableBodyProps, 
        headerGroups, 
        rows, 
        prepareRow, 
    } = tableInstance


  return (
    <table {...getTableProps()}>
        <thead>
            {
                headerGroups.map(headerGroups => (
                    <tr {...headerGroups.getHeaderGroupProps()}>
                        {
                            headerGroups.headers.map((column) => (
                            <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                {column.render('Header')}
                                <span>
                                    {column.isSorted ? (column.isSortedDesc ? <VscChevronUp />:<VscChevronDown /> ) : ''}
                                </span>
                            </th>
                        ))}
                    </tr>        
                ) )
            }
        </thead>
        <tbody {...getTableBodyProps()}>
            {
                rows.map(row => {
                    prepareRow(row)
                    return (
                        <tr {...row.getRowProps()}>
                            {
                                row.cells.map( cell =>{
                                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                })
                            }
                        </tr>
                    )
                })
            }
        </tbody>
    </table>
  )
}