import React, { useState } from "react";
import { useSortBy, useTable } from "react-table";
import PopUp from "../hive_elements/pop_up";
import { useTagsData, useTagsDelete, useTagsUpdate } from "../querys/tags";

function TagNameCell({value}){
  return <div className="text_cell"> {value} </div>
}
function ScoreCell({value}){
  return <div className="text_cell"> {value} </div>
}
function ColorCell({value, cell}){

  const tag_id = cell.row.id
  
  const [colorState, setColor] = useState(value)
  const update_color = useTagsUpdate().color

  function onChange(event){
      setColor(event.target.value)
  }

  function onBlur(){
      update_color({tag_id, color: colorState})
  }

  return(
      <input 
          type={'color'} 
          value={value}
          onChange={onChange}
          onBlur={onBlur}
      />
  )
}
function DeleteCell({cell}){

  const tag_id = cell.row.id

  const delete_tag = useTagsDelete()

  function onClick(){
    delete_tag({tag_id})
  }

  return(
    <div className="td_x" onClick={onClick}> X </div>
  )

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
            Cell: DeleteCell
          },
          {
            Header: 'צבע',
            accessor: 'color', 
            Cell: ColorCell
          },
          {
            Header: 'ניקוד',
            accessor: 'score',
            Cell: ScoreCell
          },
          {
            Header: 'שם',
            accessor: 'name',
            Cell: TagNameCell
          },
        ],
        []
      )

      return <Table columns={columns} data={data}/>
}
function TagsPop(props) {

    const tags = useTagsData()

    var data = undefined
    if(tags.data){
        var data = Object.entries(tags.data).map(([key, value]) => value)
    }
    // function create_tag_tds(){
    //     if(tags.data){
    //         var tr_elements = []
    //         var new_tags = Object.entries(tags.data)
    //         for(let [tag_key, tag] of new_tags){
    //             var tr = <tr key={tag_key}>
    //                     <TdX tag_id={tag.id}/>
    //                     <td className="td_color"> <ColorInput color = {tag.color} tag_id={tag.id}/> </td>
    //                     <td> {tag.score} </td>
    //                     <td> {tag.name} </td>
    //                 </tr>
    //             tr_elements.push(tr)
    //         }
    //         return tr_elements
    //     }
    //     return 'loading...'

    // }
    if(tags.data){
        return (
            <PopUp 
            status={props.status} 
            setState = {props.setState}
            title = 'תגיות'
            >
                {/* <table id="tags_table">
                    <tbody>
                    <tr>
                        <th> X </th>
                        <th> צבע </th>
                        <th> ניקוד </th>
                        <th> שם </th>
                    </tr>
                    {create_tag_tds()}
                    </tbody>
                </table> */}
                <TableInstens data={data} />
            </PopUp>
            );
    }
}

export default TagsPop;