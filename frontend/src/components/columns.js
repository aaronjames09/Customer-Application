import { ColumnFilter } from "./ColumnFilter"

export const COLUMNS = [
    {
        Header: 'Serial No.',
        accessor: 'sno',
        disableFilters: true
    },
    {
        Header: 'Customer name',
        accessor: 'customer_name',
        Filter: ColumnFilter
    },
    {
        Header: 'Age',
        accessor: 'age',
        disableFilters: true        
    },
    {
        Header: 'Phone',
        accessor: 'phone',
        disableFilters: true
    },
    {
        Header: 'Location',
        accessor: 'customer_location',
        Filter: ColumnFilter
    },
    {
        Header: 'Created At',
        accessor: 'created_at',
        disableFilters: true
    }
]