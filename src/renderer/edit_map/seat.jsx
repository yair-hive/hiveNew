import { useContext, useEffect, useState } from "react";
import { useRef } from "react";
import TagsCount from "../components/tags_count";
import { ActionsContext, EditContext, SelectablesContext } from "../app";
import "./seat.css";
import { DropContext, SelectedContext, SelectedRCcontext } from "./map";
import {
    useSeatBelongsCreate,
    useSeatBelongsData,
    useSeatBelongsSetFixed,
} from "../querys/seat_belongs";
import { useGuestsData } from "../querys/guests";
import { useGuestGroupsData } from "../querys/guest_groups";
import { useTagBelongsData } from "../querys/tag_belongs";
import { useSeatsDataScore } from "../querys/seats";
import { FixedContext } from "../app";
import RollingList from "../hive_elements/rolling_list";
import { ShowScoreContext } from "../pages/maps";

function DropTest({ inputStr }) {
    const guests = useGuestsData();

    const add_guest = useSeatBelongsCreate();
    const [dropDownPos, setDropDownPos] = useContext(DropContext);
    const [selected_seat, setSelectedSeat] = useContext(SelectedContext);

    // useEffect(()=> setInputStr(''),[dropDownPos])

    async function onItem(item) {
        // const {exist} = await check_guest(item.value)
        // if(exist){
        console.log(item);
        add_guest({
            guest_id: item.value,
            seat_id: dropDownPos,
        });
        // }
        setDropDownPos(null);
        setSelectedSeat(null);
    }

    function createMatchList() {
        var match_list = [];
        if (inputStr.length != 0) {
            var search_reg = new RegExp("^" + inputStr);
            var guest_array = Object.entries(guests.data);
            for (var [index, corrent] of guest_array) {
                corrent.name = corrent.last_name + " " + corrent.first_name;
                if (search_reg.test(corrent.name)) {
                    match_list.push({ name: corrent.name, value: corrent.id });
                }
            }
        }
        return match_list;
    }

    return (
        <>
            <div
                className="drop_down"
                style={{
                    position: "relative",
                    display: "inline-block",
                    margin: 0,
                }}
            >
                <RollingList items={createMatchList()} onItemClick={onItem} />
            </div>
        </>
    );
}

function getColor(backColor) {
    if (backColor) {
        var color = "black";
        var c = backColor.substring(1); // strip #
        var rgb = parseInt(c, 16); // convert rrggbb to decimal
        var r = (rgb >> 16) & 0xff; // extract red
        var g = (rgb >> 8) & 0xff; // extract green
        var b = (rgb >> 0) & 0xff; // extract blue

        var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
        if (luma < 160) {
            color = "white";
        }
        return color;
    }
}

function getFontSize(str) {
    if (str.length > 14) return "11px";
    else return "15px";
}

function NameBox({ seat_id, tags, guest_name, group_color, score }) {
    const [showScore, setShowScore] = useContext(ShowScoreContext);
    const [edit, setEdit] = useContext(EditContext);
    // const [dropDownPos, setDropDownPos] = useState(false)
    const [dropDownPos, setDropDownPos] = useContext(DropContext);
    const [selected_seat, setSelectedSeat] = useContext(SelectedContext);
    const [inputStr, setInputStr] = useState("");

    const nameBoxRef = useRef(null);

    function nameBoxOnClick() {
        if (edit == "אל תערוך") {
            // setDropDownPos(nameBoxRef.current)
            // setSelectedSeat(seat_id)
            setDropDownPos(seat_id);
        }
    }

    function onInput(event) {
        setInputStr(event.target.value);
    }

    var font_size = guest_name ? getFontSize(guest_name) : "";

    var color = getColor(group_color);

    const NAME_BOX_STYLE = {
        backgroundColor: group_color,
        fontSize: font_size,
        color: color,
    };

    if (dropDownPos == seat_id) {
        return (
            <>
                <input
                    onChange={onInput}
                    className="name_box"
                    style={{ margin: 0 }}
                />
                <DropTest inputStr={inputStr} />
            </>
        );
    }

    if (showScore) return <div className="name_box"> {score} </div>;

    return (
        <div
            className="name_box"
            style={edit !== "ערוך" ? NAME_BOX_STYLE : null}
            ref={nameBoxRef}
            onClick={nameBoxOnClick}
        >
            {edit === "ערוך" ? <TagsCount value={tags} /> : guest_name}
        </div>
    );
}

function SeatNumber({ number, belong_id, fixed, score }) {
    const [fixedState, setfixedState] = useContext(FixedContext);
    const [showScore, setShowScore] = useContext(ShowScoreContext);
    const setFixed = useSeatBelongsSetFixed();
    const [fixedValue, setFixedValue] = useState(fixed);

    useEffect(() => {
        setFixedValue(fixed);
    }, [fixed]);

    function onChange(e) {
        setFixed({ id: belong_id, value: !fixedValue });
        setFixedValue(!fixedValue);
    }

    if (showScore)
        return (
            <div
                className="num_box"
                style={{ fontSize: "9px" }}
            >{`r-${score.row_score} c-${score.col_score} p-${score.pass_score}`}</div>
        );

    if (fixedState) {
        return (
            <div
                className="num_box"
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <input
                    type="checkbox"
                    onChange={onChange}
                    checked={fixedValue}
                />
                {number}
            </div>
        );
    } else return <div className="num_box">{number}</div>;
}

function Seat({ seat }) {
    const [edit, setEdit] = useContext(EditContext);
    const [selectebls] = useContext(SelectablesContext);
    const [action, setAction] = useContext(ActionsContext);
    const [selectedRC, setSelectedRC] = useContext(SelectedRCcontext);

    const belongs = useSeatBelongsData();
    const guests = useGuestsData();
    const groups = useGuestGroupsData();
    const tagsBelongs = useTagBelongsData();
    const score = useSeatsDataScore();

    var score_object = undefined;

    if (score.data) {
        score_object = {};
        score.data.forEach((seat) => {
            score_object[seat.id] = seat;
        });
    }

    var guest_id;
    var belong_id;
    var fixed;
    if (belongs.data) {
        var belongs_object = {};
        belongs.data.forEach(
            (belong) => (belongs_object[belong.seat] = belong)
        );
        var seat_belong = belongs_object[seat.id];
        guest_id = seat_belong?.guest;
        belong_id = seat_belong?.id;
        if (seat_belong) {
            if (seat_belong.fixed == 0) fixed = false;
            if (seat_belong.fixed == 1) fixed = true;
        }
    }

    var guests_object;
    if (guests.data) {
        guests_object = {};
        guests.data.forEach((guest) => (guests_object[guest.id] = guest));
    }

    var guest = guests_object && guest_id ? guests_object[guest_id] : null;

    var guest_name = guest ? `${guest.last_name} ${guest.first_name}` : "";

    var group_color =
        guest && groups.data
            ? groups.data[guest.guest_group]?.color
            : undefined;

    var tags = tagsBelongs.data ? tagsBelongs.data[seat.id] : null;

    if (edit === "ערוך" && selectebls === "seats") {
        var selectable_class = " selectable";
        var selected_class =
            (selectedRC.dir === "row" &&
                selectedRC.number === Number(seat.row_num)) ||
            (selectedRC.dir === "col" &&
                selectedRC.number === Number(seat.col_num))
                ? " selected"
                : "";
    } else {
        var selectable_class = "";
        var selected_class = "";
    }

    if (seat.in_group && action === "groups" && edit === "ערוך")
        var selectable_class = "";

    var class_name = `seat${selectable_class}${selected_class}`;

    return (
        <div>
            <div
                className={class_name}
                seat_id={seat.id}
                cell-row={seat.row_num}
                cell-col={seat.col_num}
            >
                <SeatNumber
                    number={seat.seat_number}
                    belong_id={belong_id}
                    score={seat}
                    fixed={fixed}
                />
                <NameBox
                    seat_id={seat.id}
                    guest_name={guest_name}
                    group_color={group_color}
                    tags={tags}
                    score={seat.score}
                />
            </div>
        </div>
    );
}

export default Seat;
