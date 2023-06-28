import React from "react"
import { useUserDataAll } from "../querys/users"
import { useTable } from "react-table"


function TableInstens({data, columns}){

    const memo_data = React.useMemo(()=> data, [])
    const memo_columns = React.useMemo(()=> columns, [])

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        setAllFilters,
    } = useTable(
        {
            columns: memo_columns,
            data: memo_data,
            getRowId: function(row, relativeIndex, parent){
                return data[relativeIndex].id
            }
        },
    )

    return(
        <table className="names_table" dir="rtl" {...getTableProps()}>
            <thead>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th {...column.getHeaderProps()}>
                                {column.render('Header')}
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map((row, i) => {
                        prepareRow(row);
                        return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map(cell => {
                            return (
                                <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                            )
                            })}
                        </tr>
                    )}
                )}
            </tbody>
        </table>
    )
}

function UsersList(){

    function CellDelete(props){
        const user_id = props.cell.row.id

        return(
            <div> delete </div>
        )
    }

    const users = useUserDataAll()
    const columns = [
        {
            Header: "שם משתמש",
            accessor: "user_name",
        },
        {
            Header: "קבוצות",
            accessor: "user_groups",
        },
        {
            Header: "מחק",
            accessor: "delete",
            Cell: CellDelete
        },
    ]

    if(!users.data) return 'loading'

    if(users.data) return <TableInstens data={users.data} columns={columns}/>
}

export default UsersList