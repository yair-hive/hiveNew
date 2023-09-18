/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable import/no-cycle */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable camelcase */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { useSortBy, useTable } from 'react-table';
import api from 'renderer/api/api';
import PopUp from '../hive_elements/pop_up';

function TagNameCell({ value }) {
  return <div className="text_cell"> {value} </div>;
}
function ScoreCell(props) {
  const initialValue = props.value;
  const tag_id = props.cell.row.id;

  const [isScoreInput, setScoreInput] = useState(false);
  const [score, setScore] = useState(initialValue);
  const update_score = api.tags.useUpdate().score;

  useEffect(() => setScore(initialValue), [initialValue]);

  function onTdClick() {
    setScoreInput(true);
  }
  function onInputBlur() {
    update_score({ tag_id, score });
    setScoreInput(false);
  }

  function onInputChange(event) {
    setScore(Number(event.target.value));
  }

  if (isScoreInput) {
    return (
      <input
        type="text"
        autoFocus
        value={score}
        onBlur={onInputBlur}
        onChange={onInputChange}
        style={{
          width: `${score.toString().length}ch`,
        }}
      />
    );
  }

  return (
    <div onClick={onTdClick} className="text_cell">
      {score}
    </div>
  );
}
function ColorCell({ value, cell }) {
  const tag_id = cell.row.id;

  const [colorState, setColor] = useState(value);
  const update_color = api.tags.useUpdate().color;

  function onChange(event) {
    setColor(event.target.value);
  }

  function onBlur() {
    update_color({ tag_id, color: colorState });
  }

  return (
    <input type="color" value={value} onChange={onChange} onBlur={onBlur} />
  );
}
function CodeCell(props) {
  const initialValue = props.value;
  const tag_id = props.cell.row.id;

  const [isCodeInput, setCodeInput] = useState(false);
  const [code, setCode] = useState(initialValue);
  const updateCode = api.tags.useUpdate().code;

  useEffect(() => setCode(initialValue), [initialValue]);

  function onTdClick() {
    setCodeInput(true);
  }
  function onInputBlur() {
    updateCode({ tag_id, code });
    setCodeInput(false);
  }

  function onInputChange(event) {
    setCode(Number(event.target.value));
  }

  if (isCodeInput) {
    return (
      <input
        type="text"
        autoFocus
        value={code}
        onBlur={onInputBlur}
        onChange={onInputChange}
        style={{
          width: `${code.toString().length}ch`,
        }}
      />
    );
  }

  return (
    <div onClick={onTdClick} className="text_cell">
      {code}
    </div>
  );
}
function DeleteCell({ cell }) {
  const tag_id = cell.row.id;

  const delete_tag = api.tags.useDelete();

  function onClick() {
    delete_tag({ tag_id });
  }

  return (
    <div className="td_x" onClick={onClick}>
      {' '}
      X{' '}
    </div>
  );
}

function Table({ columns, data }) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data,
        getRowId: (row, relativeIndex) => {
          return data[relativeIndex].id;
        },
      },
      useSortBy
    );

  // We don't want to render all 2000 rows for this example, so cap
  // it at 20 for this use case
  const firstPageRows = rows.slice(0, 20);

  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              // Add the sorting props to control sorting. For this example
              // we can add them into the header props
              <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                {column.render('Header')}
                {/* Add a sort direction indicator */}
                <span>
                  {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                </span>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {firstPageRows.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function TableInstens({ data }) {
  const columns = React.useMemo(
    () => [
      {
        Header: 'x',
        accessor: 'x',
        Cell: DeleteCell,
      },
      {
        Header: 'קוד',
        accessor: 'code',
        Cell: CodeCell,
      },
      {
        Header: 'צבע',
        accessor: 'color',
        Cell: ColorCell,
      },
      {
        Header: 'ניקוד',
        accessor: 'score',
        Cell: ScoreCell,
      },
      {
        Header: 'שם',
        accessor: 'name',
        Cell: TagNameCell,
      },
    ],
    []
  );

  return <Table columns={columns} data={data} />;
}
function TagsPop(props) {
  const tags = api.tags.useData();

  let data;
  if (tags.data) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    data = Object.entries(tags.data).map(([key, value]) => value);
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
  if (tags.data) {
    return (
      <PopUp status={props.status} setState={props.setState} title="תגיות">
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
