import React, { useEffect, useState } from "react"
import PopUp from "../hive_elements/pop_up"
import { useGuestGroupsData, useGuestGroupsDelete, useGuestGroupsUpdate } from "../querys/guest_groups"
import { useSortBy, useTable } from "react-table"

function TdColor({value, cell}){

    const group_id = cell.row.id

    const update_color = useGuestGroupsUpdate().color

    const [colorState, setColorState] = useState(value)

    useEffect(()=> setColorState(value), [value])

    function onInputChenge(event){
        setColorState(event.target.value)
    }

    function onBlur(){
        update_color({group_id, color: colorState})        
    }

    return (
        <input type='color' value={colorState} onChange={onInputChenge} onBlur={onBlur}/>
    )
}

function TdScore({value, cell}){

    const group_id = cell.row.id

    const [isInput, setInput] = useState(false)
    const [scoreState, setScore] = useState(value)
    const update_score = useGuestGroupsUpdate().score

    useEffect(()=> setScore(value), [value])

    function onChange(event){
        setScore(event.target.value)
    }
    function onBlur(){
        setInput(false)
        update_score({group_id: group_id, score: scoreState})
    }

    if(isInput) return (
        <input 
            value={scoreState}
            style={{width: `${scoreState.toString().length}ch`}}
            onChange={onChange}
            onBlur={onBlur}
        />
    )

    return (
        <div className="text_cell" onClick={()=> setInput(true)}> 
            {scoreState} 
        </div>
    )
}

function TdName({value}){
    return <div className="text_cell">{value}</div>
}

function TdX({cell}){

    const group_id = cell.row.id

    const delete_group = useGuestGroupsDelete()

    function onClick(){delete_group(group_id)}

    return <div className="td_x" onClick={onClick}> X </div>
}

function Table({ columns, data }) {
    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      rows,
      prepareRow,
    } = useTable(
      {
        columns,
        data,
        getRowId: function(row, relativeIndex, parent){
          return data[relativeIndex].id
        }
      },
      useSortBy
    )
  
    // We don't want to render all 2000 rows for this example, so cap
    // it at 20 for this use case
    const firstPageRows = rows.slice(0, 20)
  
    return (
      <>
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  // Add the sorting props to control sorting. For this example
                  // we can add them into the header props
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render('Header')}
                    {/* Add a sort direction indicator */}
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
            {firstPageRows.map(
              (row, i) => {
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
      </>
    )
}

function TableInstens({data}){
    
    const columns = React.useMemo(
        () => [
          {
            Header: 'x',
            accessor: 'x',
            Cell: TdX
          },
          {
            Header: 'צבע',
            accessor: 'color', 
            Cell: TdColor
          },
          {
            Header: 'ניקוד',
            accessor: 'score',
            Cell: TdScore
          },
          {
            Header: 'שם',
            accessor: 'name',
            Cell: TdName
          },
        ],
        []
    )

    return <Table columns={columns} data={data}/>
}

function GroupsPop(props){

    const groups = useGuestGroupsData()

    if(groups.data) {

        var groups_array = Object.entries(groups.data)
        var data = groups_array.map(group => group[1])

        return (
            <PopUp
                status={props.status} 
                setState = {props.setState}
                title = 'קבוצות'
            >
                <TableInstens data={data}/>
            </PopUp>
        )
    }

    // function create_rows(){
    //     if(groups.data){
    //         var rows = []
    //         var groups_array = Object.entries(groups.data)
    //         for(let [key, group] of groups_array){
    //             var tr = (<tr key={key}>
    //                 <TdX group_id={group.id}/>
    //                 <TdColor color={group.color} group_id={group.id}/>
    //                 <TdScore score={group.score} group_id={group.id}/>
    //                 <TdName name={group.name} group_id={group.id}/>
    //             </tr>)
    //             rows.push(tr)
    //         }
    //         return rows
    //     }
    // }

    // return (
    // <PopUp
    //     status={props.status} 
    //     setState = {props.setState}
    //     title = 'קבוצות'
    // >
    //     <table id="groups_table">
    //         <thead>
    //             <tr>
    //                 <th> X </th>
    //                 <th> צבע </th>
    //                 <th> ניקוד </th>
    //                 <th> שם </th> 
    //             </tr>
    //         </thead>
    //         <tbody>
    //             {create_rows()}
    //         </tbody>
    //     </table>
    // </PopUp>)
}

export default GroupsPop