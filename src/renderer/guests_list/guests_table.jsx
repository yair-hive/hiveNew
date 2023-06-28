/* eslint-disable react/jsx-key */
import "./guests_table.css";
import TableRow from "./table_row";
import React, { useContext, useEffect, useRef, useState } from "react";
import RequestsDrop from "./requestsDrop";
import { useSeatsDataAll } from "../querys/seats";
import {
    useGuestsData,
    useGuestsDelete,
    useGuestsUpdate,
} from "../querys/guests";
import { useGuestGroupsData } from "../querys/guest_groups";
import { useTagBelongsData } from "../querys/tag_belongs";
import { useSeatBelongsData } from "../querys/seat_belongs";
import { MBloaderContext, TableRefContext } from "../app";
import { useSortBy, useTable } from "react-table";
import TagsCount from "../components/tags_count";
import { BelongsContext, GroupsContext, TagsContext } from "../app";
import { useFilters } from "react-table/dist/react-table.development";
import RequestsCount from "../components/requestsCount";
import { useRequestsBelongsData } from "../querys/requests_belongs";
import MBloader from "../hive_elements/MBloader";

const DropPosContext = React.createContext([]);
const SelectedGuestContext = React.createContext([]);

function Table({ columns, data }) {
    const [page, setPage] = useState(0);
    const [TableRefState, setTableRefState] = useContext(TableRefContext);
    const tableRef = useRef(null);

    useEffect(() => {
        setTableRefState(tableRef.current);
    }, []);

    const [tagsStatus, setTagsStatus] = useContext(TagsContext);
    const [groupsStatus, setGroupsStatus] = useContext(GroupsContext);
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
            getRowId: function (row, relativeIndex, parent) {
                return data[relativeIndex].guest_id;
            },
        },
        useFilters,
        useSortBy
    );

    useEffect(() => {
        setAllFilters([
            { id: "seat_number", value: belongsStatus },
            { id: "tags", value: tagsStatus },
            { id: "group_name", value: groupsStatus },
        ]);
    }, [tagsStatus, groupsStatus, belongsStatus]);

    const rows_num = 100;
    var slice_from = page * rows_num;
    var firstPageRows = rows.slice(slice_from, slice_from + rows_num);

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
                                <th
                                    {...column.getHeaderProps(
                                        column.getSortByToggleProps()
                                    )}
                                >
                                    {column.render("Header")}
                                    {/* Add a sort direction indicator */}
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
                    {firstPageRows.map((row, i) => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map((cell) => {
                                    return (
                                        <td {...cell.getCellProps()}>
                                            {cell.render("Cell")}
                                        </td>
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
    var id = columnsIds[0];
    return rows.filter((row) => {
        var row_value = row.values[id];
        if (filterValue == "משובצים") return row_value;
        if (filterValue == "לא משובצים") return !row_value;
        return filterValue == "הכל";
    });
}

function filterTags(rows, columnsIds, filterValue) {
    var id = columnsIds[0];
    return rows.filter((row) => {
        var row_value = row.values[id];
        row_value = row_value.map((tag) => tag.tag);
        for (let value of filterValue) {
            if (row_value.indexOf(value) != -1) return true;
        }
        return filterValue.indexOf("הכל") != -1;
    });
}
function filterGroups(rows, columnsIds, filterValue) {
    var id = columnsIds[0];
    return rows.filter((row) => {
        var row_value = row.values[id];
        return (
            filterValue.indexOf(row_value) != -1 ||
            filterValue.indexOf("הכל") != -1
        );
    });
}

function SeatNumberCell({ value }) {
    var backgroundColor = value ? "green" : "gray";
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
    const update_last = useGuestsUpdate().last;

    function onTdClick() {
        setLastInput(true);
    }

    useEffect(() => {
        setLast(initialValue);
    }, [initialValue]);

    function onInputBlur() {
        setLastInput(false);
        update_last({ last: last, guest_id });
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
    const update_first = useGuestsUpdate().first;

    useEffect(() => setFirst(initialValue), [initialValue]);

    function onTdClick() {
        setFirstInput(true);
    }

    function onInputBlur() {
        setFirstInput(false);
        update_first({ first, guest_id });
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
    const update_group = useGuestsUpdate().group;

    useEffect(() => setGroup(initialValue), [initialValue]);

    function onTdClick() {
        setGroupInput(true);
    }

    function onInputBlur() {
        setGroupInput(false);
        update_group({ group, guest_id });
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
    const value = props.value;
    const guest_id = props.cell.row.id;

    const [dropPos, setDropPos] = useContext(DropPosContext);
    const [selectedGuest, setSelectedGuest] = useContext(SelectedGuestContext);

    const tdRef = useRef(null);

    function onClick(event) {
        var classList = event.target.classList;
        if (!classList.contains("delete")) {
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
    const update_score = useGuestsUpdate().score;

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

    const delete_guest = useGuestsDelete();

    function on_td_x() {
        delete_guest({ guest_id });
    }

    return (
        <div className="td_x" onClick={on_td_x}>
            {" "}
            x{" "}
        </div>
    );
}
function TableInstens({ data }) {
    const columns = React.useMemo(
        () => [
            {
                Header: "מספר כיסא",
                accessor: "seat_number",
                Cell: SeatNumberCell,
                filter: filterBelongs,
            },
            {
                Header: "תגיות",
                accessor: "tags",
                Cell: TagsCount,
                filter: filterTags,
                disableSortBy: true,
            },
            {
                Header: "שם משפחה",
                accessor: "last_name",
                Cell: LastNameCell,
            },
            {
                Header: "שם פרטי",
                accessor: "first_name",
                Cell: FirstNameCell,
            },
            {
                Header: "שיעור",
                accessor: "group_name",
                filter: filterGroups,
                Cell: GroupNameCell,
            },
            {
                Header: "ניקוד",
                accessor: "score",
                Cell: ScoreCell,
            },
            {
                Header: "בקשות",
                accessor: "requests",
                Cell: RequestsCell,
                disableSortBy: true,
            },
            {
                Header: "x",
                accessor: "x",
                Cell: DeleteCell,
                disableSortBy: true,
            },
        ],
        []
    );

    return <Table columns={columns} data={data} />;
}

function GuestsTable() {
    const seats = useSeatsDataAll();
    const belongs = useSeatBelongsData();
    const guests = useGuestsData();
    const groups = useGuestGroupsData();
    const requests = useRequestsBelongsData();
    const tags_belongs = useTagBelongsData();

    const [status, setStatus] = useContext(MBloaderContext);

    const [dropPos, setDropPos] = useState(null);
    const [selectedGuest, setSelectedGuest] = useState(null);

    function create_rows() {
        var rows = [];
        var i = 0;
        if (
            guests.data &&
            belongs.data &&
            groups.data &&
            seats.data &&
            tags_belongs.data &&
            requests.data
        ) {
            var belongs_object = {};
            var seats_object = {};
            var requests_object = {};
            requests.data.forEach(
                (request) => (requests_object[request.guest] = [])
            );
            requests.data.forEach((request) =>
                requests_object[request.guest].push(request)
            );
            belongs.data.forEach(
                (belong) => (belongs_object[belong.guest] = belong)
            );
            seats.data.forEach((seat) => (seats_object[seat.id] = seat));
            for (let guest of guests.data) {
                i++;
                var seat_id = false;
                var group = groups.data[guest.guest_group];
                if (belongs_object[guest.id])
                    seat_id = belongs_object[guest.id].seat;
                var seat = seats_object[seat_id];
                var tags = tags_belongs.data[seat_id]
                    ? tags_belongs.data[seat_id]
                    : [];
                var group_score = group ? group.score : 0;
                rows.push({
                    guest_id: guest.id,
                    last_name: guest.last_name,
                    first_name: guest.first_name,
                    group_name: group?.name,
                    seat_number: seat?.seat_number,
                    tags: tags,
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
        <SelectedGuestContext.Provider
            value={[selectedGuest, setSelectedGuest]}
        >
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
