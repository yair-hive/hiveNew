/* eslint-disable react/jsx-no-constructed-context-values */
/* eslint-disable no-plusplus */
/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable camelcase */
/* eslint-disable react/prop-types */
/* eslint-disable import/no-cycle */
/* eslint-disable react/jsx-key */
import './guests_table.css';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useSortBy, useTable } from 'react-table';
import { useFilters } from 'react-table/dist/react-table.development';
import api from 'renderer/api/api';
import RequestsDrop from './requestsDrop';
import {
  TableRefContext,
  BelongsContext,
  GroupsContext,
  TagsContext,
} from '../app';
import TagsCount from '../components/tags_count';
import RequestsCount from '../components/requestsCount';
import MBloader from '../hive_elements/MBloader';

const DropPosContext = React.createContext([]);
const SelectedGuestContext = React.createContext([]);

function Table({ columns, data }) {
  const [page, setPage] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [TableRefState, setTableRefState] = useContext(TableRefContext);
  const tableRef = useRef(null);

  useEffect(() => {
    setTableRefState(tableRef.current);
  }, [setTableRefState]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [tagsStatus, setTagsStatus] = useContext(TagsContext);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [groupsStatus, setGroupsStatus] = useContext(GroupsContext);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [belongsStatus, setBelongsStatus] = useContext(BelongsContext);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setAllFilters,
  } = useTable(
    {
      columns,
      data,
      getRowId(row, relativeIndex) {
        return data[relativeIndex].guest_id;
      },
    },
    useFilters,
    useSortBy
  );

  useEffect(() => {
    setAllFilters([
      { id: 'seat_number', value: belongsStatus },
      { id: 'tags', value: tagsStatus },
      { id: 'group_name', value: groupsStatus },
    ]);
  }, [tagsStatus, groupsStatus, belongsStatus, setAllFilters]);

  const rows_num = 100;
  const slice_from = page * rows_num;
  const firstPageRows = rows.slice(slice_from, slice_from + rows_num);

  return (
    <>
      <div className="hive_button" onClick={() => setPage(page + 1)}>
        הבא
      </div>
      <div className="hive_button" onClick={() => setPage(page - 1)}>
        הקודם
      </div>
      <table
        className="names_table"
        dir="rtl"
        {...getTableProps()}
        ref={tableRef}
      >
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
          {firstPageRows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

function filterBelongs(rows, columnsIds, filterValue) {
  const id = columnsIds[0];
  return rows.filter((row) => {
    const row_value = row.values[id];
    if (filterValue === 'משובצים') return row_value;
    if (filterValue === 'לא משובצים') return !row_value;
    return filterValue === 'הכל';
  });
}

function filterTags(rows, columnsIds, filterValue) {
  const id = columnsIds[0];
  return rows.filter((row) => {
    let row_value = row.values[id];
    row_value = row_value.map((tag) => tag.tag);
    for (const value of filterValue) {
      if (row_value.indexOf(value) !== -1) return true;
    }
    return filterValue.indexOf('הכל') !== -1;
  });
}
function filterGroups(rows, columnsIds, filterValue) {
  const id = columnsIds[0];
  return rows.filter((row) => {
    const row_value = row.values[id];
    return (
      filterValue.indexOf(row_value) !== -1 || filterValue.indexOf('הכל') !== -1
    );
  });
}

function SeatNumberCell({ value }) {
  const backgroundColor = value ? 'green' : 'gray';
  return (
    <div style={{ backgroundColor }} className="table_cell">
      {value}
    </div>
  );
}
function LastNameCell(props) {
  const initialValue = props.value;
  const guest_id = props.cell.row.id;

  const [isLastInput, setLastInput] = useState(false);
  const [last, setLast] = useState(initialValue);
  const update_last = api.guests.useUpdate().last;

  function onTdClick() {
    setLastInput(true);
  }

  useEffect(() => {
    setLast(initialValue);
  }, [initialValue]);

  function onInputBlur() {
    setLastInput(false);
    update_last({ last_name: last, guest_id });
  }

  function onInputChange(event) {
    setLast(event.target.value);
  }

  if (isLastInput) {
    return (
      <input
        type="text"
        autoFocus
        value={last}
        onBlur={onInputBlur}
        onChange={onInputChange}
        style={{
          width: `${last.length}ch`,
        }}
      />
    );
  }

  return (
    <div className="text_cell" onClick={onTdClick}>
      {last}
    </div>
  );
}
function FirstNameCell(props) {
  const initialValue = props.value;
  const guest_id = props.cell.row.id;

  const [isFirstInput, setFirstInput] = useState(false);
  const [first, setFirst] = useState(initialValue);
  const update_first = api.guests.useUpdate().first;

  useEffect(() => setFirst(initialValue), [initialValue]);

  function onTdClick() {
    setFirstInput(true);
  }

  function onInputBlur() {
    setFirstInput(false);
    update_first({ first_name: first, guest_id });
  }

  function onInputChange(event) {
    setFirst(event.target.value);
  }

  if (isFirstInput) {
    return (
      <input
        type="text"
        autoFocus
        value={first}
        onBlur={onInputBlur}
        onChange={onInputChange}
        style={{
          width: `${first.length}ch`,
        }}
      />
    );
  }

  return (
    <div className="text_cell" onClick={onTdClick}>
      {first}
    </div>
  );
}
function GroupNameCell(props) {
  const initialValue = props.value;
  const guest_id = props.cell.row.id;

  const [isGroupInput, setGroupInput] = useState(false);
  const [group, setGroup] = useState(initialValue);
  const update_group = api.guests.useUpdate().group;

  useEffect(() => setGroup(initialValue), [initialValue]);

  function onTdClick() {
    setGroupInput(true);
  }

  function onInputBlur() {
    setGroupInput(false);
    update_group({ group_name: group, guest_id });
  }

  function onInputChange(event) {
    setGroup(event.target.value);
  }

  if (isGroupInput) {
    return (
      <input
        type="text"
        autoFocus
        value={group}
        onBlur={onInputBlur}
        onChange={onInputChange}
        style={{
          width: `${group.length}ch`,
        }}
      />
    );
  }

  return (
    <div onClick={onTdClick} className="text_cell">
      {group}
    </div>
  );
}
function RequestsCell(props) {
  const { value } = props;
  const guest_id = props.cell.row.id;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [dropPos, setDropPos] = useContext(DropPosContext);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedGuest, setSelectedGuest] = useContext(SelectedGuestContext);

  const tdRef = useRef(null);

  function onClick(event) {
    const { classList } = event.target;
    if (!classList.contains('delete')) {
      setDropPos(tdRef.current);
      setSelectedGuest(guest_id);
    }
  }

  return (
    <div ref={tdRef} onClick={onClick} className="table_cell">
      <RequestsCount value={value} />
    </div>
  );
}
function ScoreCell(props) {
  const initialValue = props.value;
  const guest_id = props.cell.row.id;

  const [isScoreInput, setScoreInput] = useState(false);
  const [score, setScore] = useState(initialValue);
  const update_score = api.guests.useUpdate().score;

  useEffect(() => setScore(initialValue), [initialValue]);

  function onTdClick() {
    setScoreInput(true);
  }
  function onInputBlur() {
    update_score({ guest_id, score });
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
function DeleteCell(props) {
  const guest_id = props.cell.row.id;

  const delete_guest = api.guests.useDelete();

  function on_td_x() {
    delete_guest({ guest_id });
  }

  return (
    <div className="td_x" onClick={on_td_x}>
      {' '}
      x{' '}
    </div>
  );
}
function TableInstens({ data }) {
  const columns = React.useMemo(
    () => [
      {
        Header: 'מספר כיסא',
        accessor: 'seat_number',
        Cell: SeatNumberCell,
        filter: filterBelongs,
      },
      {
        Header: 'תגיות',
        accessor: 'tags',
        Cell: TagsCount,
        filter: filterTags,
        disableSortBy: true,
      },
      {
        Header: 'שם משפחה',
        accessor: 'last_name',
        Cell: LastNameCell,
      },
      {
        Header: 'שם פרטי',
        accessor: 'first_name',
        Cell: FirstNameCell,
      },
      {
        Header: 'שיעור',
        accessor: 'group_name',
        filter: filterGroups,
        Cell: GroupNameCell,
      },
      {
        Header: 'ניקוד',
        accessor: 'score',
        Cell: ScoreCell,
      },
      {
        Header: 'בקשות',
        accessor: 'requests',
        Cell: RequestsCell,
        disableSortBy: true,
      },
      {
        Header: 'x',
        accessor: 'x',
        Cell: DeleteCell,
        disableSortBy: true,
      },
    ],
    []
  );

  return <Table columns={columns} data={data} />;
}

function GuestsTable() {
  const seats = api.seats.useDataAll();
  const belongs = api.seatBelongs.useData();
  const guests = api.guests.useData();
  const groups = api.guestGroup.useData();
  const requests = api.requestsBelongs.useData();
  const tags_belongs = api.tagBelongs.useData();

  const [dropPos, setDropPos] = useState(null);
  const [selectedGuest, setSelectedGuest] = useState(null);

  function create_rows() {
    const rows = [];
    if (
      guests.data &&
      belongs.data &&
      groups.data &&
      seats.data &&
      tags_belongs.data &&
      requests.data
    ) {
      const belongs_object = {};
      const seats_object = {};
      const requests_object = {};
      requests.data.forEach((request) => {
        requests_object[request.guest] = [];
      });
      requests.data.forEach((request) =>
        requests_object[request.guest].push(request)
      );
      belongs.data.forEach((belong) => {
        belongs_object[belong.guest] = belong;
      });
      seats.data.forEach((seat) => {
        seats_object[seat.id] = seat;
      });
      for (const guest of guests.data) {
        let seat_id = false;
        const group = groups.data[guest.guest_group];
        if (belongs_object[guest.id]) seat_id = belongs_object[guest.id].seat;
        const seat = seats_object[seat_id];
        const tags = tags_belongs.data[seat_id]
          ? tags_belongs.data[seat_id]
          : [];
        const group_score = group ? group.score : 0;
        rows.push({
          guest_id: guest.id,
          last_name: guest.last_name,
          first_name: guest.first_name,
          group_name: group?.name,
          seat_number: seat?.seat_number,
          tags,
          score: Number(group_score) + Number(guest.score),
          requests: requests_object[guest.id],
        });
      }
    }
    return rows;
  }

  // if(guests.isLoading || belongs.isLoading || groups.isLoading || seats.isLoading || tags_belongs.isLoading || requests.isLoading) setStatus(101)
  // if(guests.isFetching || belongs.isFetching || groups.isFetching || seats.isFetching || tags_belongs.isFetching || requests.isFetching) setStatus(101)
  // if(guests.data && belongs.data && groups.data && seats.data && tags_belongs.data && requests.data) setStatus(0)

  return (
    <SelectedGuestContext.Provider value={[selectedGuest, setSelectedGuest]}>
      <DropPosContext.Provider value={[dropPos, setDropPos]}>
        <MBloader />
        <div className="guest_table">
          <RequestsDrop
            pos={dropPos}
            setPos={setDropPos}
            selected={selectedGuest}
            setSelected={setSelectedGuest}
          />
          <TableInstens data={create_rows()} />
        </div>
      </DropPosContext.Provider>
    </SelectedGuestContext.Provider>
  );
}

export default GuestsTable;
