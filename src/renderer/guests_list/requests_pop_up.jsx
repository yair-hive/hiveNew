/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-cycle */
import PopUp from 'renderer/hive_elements/pop_up';
import React, { useContext } from 'react';
import api from 'renderer/api/api';
import { useTable, useSortBy } from 'react-table';
import { RequestBox } from 'renderer/components/requestsCount';
import { RequestsCurrentGuestContest } from './guests_table';

function RequestsTable({ data, columns }) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        data,
        columns,
        getRowId(row, relativeIndex) {
          return data[relativeIndex].id;
        },
      },
      useSortBy
    );
  return (
    <table className="names_table" dir="rtl" {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              // Add the sorting props to control sorting. For this example
              // we can add them into the header props
              // eslint-disable-next-line react/jsx-key
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
        {rows.map((row) => {
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
function PriorityCell({ value }) {
  return (
    <div style={{ padding: '2px', paddingLeft: '5px', paddingRight: '5px' }}>
      {' '}
      {`בקשה מספר ${value}`}{' '}
    </div>
  );
}
function RequestCell(props) {
  const requestId = props.cell.row.id;

  return (
    <div style={{ padding: '5px' }}>
      <RequestBox request_id={requestId} tag_id={props.value} />
    </div>
  );
}
function DeleteCell() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        className="td_x"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '13px',
          width: '19px',
          height: '19px',
        }}
      >
        {' '}
        &#10005;{' '}
      </div>
    </div>
  );
}
function RequestsPopUp() {
  const requests = api.requestsBelongs.useData();
  const [requestsCurrentGuset, setRequestsCurrentGuset] = useContext(
    RequestsCurrentGuestContest
  );

  const columns = React.useMemo(
    () => [
      {
        Header: 'עדיפות',
        accessor: 'index_key',
        Cell: PriorityCell,
      },
      {
        Header: 'בקשה',
        accessor: 'request',
        Cell: RequestCell,
      },
      {
        Header: 'x',
        accessor: 'x',
        Cell: DeleteCell,
      },
    ],
    []
  );
  if (requests.data) {
    const requestsObject = {};
    requests.data.forEach((request) => {
      requestsObject[request.guest] = [];
    });
    requests.data.forEach((request) =>
      requestsObject[request.guest].push(request)
    );
    return (
      <PopUp status={requestsCurrentGuset} setState={setRequestsCurrentGuset}>
        <RequestsTable
          data={requestsObject[requestsCurrentGuset]}
          columns={columns}
        />
      </PopUp>
    );
  }
}

export default RequestsPopUp;
