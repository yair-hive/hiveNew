/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unknown-property */
/* eslint-disable no-redeclare */
/* eslint-disable block-scoped-var */
/* eslint-disable no-var */
/* eslint-disable vars-on-top */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-bitwise */
/* eslint-disable consistent-return */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-restricted-syntax */
/* eslint-disable camelcase */
/* eslint-disable react/prop-types */
/* eslint-disable import/no-cycle */
import '../style/drop_down.css';
import { useContext, useEffect, useState, useRef } from 'react';
import DropDown from 'renderer/components/dropDown/dropDown';
import api from 'renderer/api/api';
import TagsCount from '../components/tags_count';
import {
  ActionsContext,
  EditContext,
  SelectablesContext,
  FixedContext,
} from '../app';
import './seat.css';
import { DropContext, SelectedContext, SelectedRCcontext } from './map';
import RollingList from '../hive_elements/rolling_list';
import { ShowScoreContext } from '../pages/maps';

function Drop({ inputStr }) {
  const guests = api.guests.useData();
  const guestGroups = api.guestGroup.useData();
  const belongs = api.seatBelongs.useData();
  const add_guest = api.seatBelongs.useCreate();
  const [dropDownPos, setDropDownPos] = useContext(DropContext);
  const setSelectedSeat = useContext(SelectedContext)[1];

  const belongIds = [];

  belongs.data.forEach((belong) => {
    belongIds.push(belong.guest);
  });

  async function onItem(item) {
    add_guest({
      guest_id: item.value,
      seat_id: dropDownPos,
    });
    setDropDownPos(null);
    setSelectedSeat(null);
  }

  function createMatchList() {
    const match_list = [];
    if (inputStr.length !== 0) {
      const search_reg = new RegExp(`^${inputStr}`);
      const guest_array = Object.entries(guests.data);
      for (const [index, corrent] of guest_array) {
        corrent.name = `${corrent.last_name} ${corrent.first_name}`;
        if (search_reg.test(corrent.name)) {
          const guestGroup = guestGroups.data[corrent.guest_group].name;
          const guestName = (
            <div>
              <span
                style={{
                  color: `${
                    belongIds.indexOf(corrent.id) !== -1
                      ? 'rgb(164, 88, 88)'
                      : ''
                  }`,
                }}
              >
                {`${corrent.name} `}
              </span>
              | <span style={{ color: 'grey' }}>{guestGroup}</span>
            </div>
          );
          match_list.push({ name: guestName, value: corrent.id });
        }
      }
    }
    return match_list;
  }

  return (
    <DropDown open={createMatchList().length > 0}>
      <RollingList items={createMatchList()} onItemClick={onItem} />
    </DropDown>
  );
}

function getColor(backColor) {
  if (backColor) {
    let color = 'black';
    const c = backColor.substring(1); // strip #
    const rgb = parseInt(c, 16); // convert rrggbb to decimal
    const r = (rgb >> 16) & 0xff; // extract red
    const g = (rgb >> 8) & 0xff; // extract green
    const b = (rgb >> 0) & 0xff; // extract blue

    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
    if (luma < 160) {
      color = 'white';
    }
    return color;
  }
}

function getFontSize(str) {
  if (str.length > 14) return '11px';
  return '15px';
}

function NameBox({ seat_id, tags, guest_name, group_color, score }) {
  const [showScore, setShowScore] = useContext(ShowScoreContext);
  const [edit, setEdit] = useContext(EditContext);
  const [dropDownPos, setDropDownPos] = useContext(DropContext);
  const [selected_seat, setSelectedSeat] = useContext(SelectedContext);
  const [inputStr, setInputStr] = useState('');

  const nameBoxRef = useRef(null);

  function nameBoxOnClick() {
    if (edit === 'אל תערוך') {
      setDropDownPos(seat_id);
    }
  }

  function onInput(event) {
    setInputStr(event.target.value);
  }

  const font_size = guest_name ? getFontSize(guest_name) : '';

  const color = getColor(group_color);

  const NAME_BOX_STYLE = {
    backgroundColor: group_color,
    fontSize: font_size,
    color,
  };

  if (dropDownPos === seat_id) {
    return (
      <>
        <input
          onChange={onInput}
          className="name_box"
          style={{ margin: 0 }}
          autoFocus
        />
        <Drop inputStr={inputStr} />
      </>
    );
  }

  if (showScore) return <div className="name_box"> {score} </div>;

  return (
    <div
      className="name_box"
      style={edit !== 'ערוך' ? NAME_BOX_STYLE : null}
      ref={nameBoxRef}
      onClick={nameBoxOnClick}
    >
      {edit === 'ערוך' ? <TagsCount value={tags} /> : guest_name}
    </div>
  );
}

function SeatNumber({ number, belong_id, fixed, score }) {
  const [fixedState, setfixedState] = useContext(FixedContext);
  const [showScore, setShowScore] = useContext(ShowScoreContext);
  const setFixed = api.seatBelongs.useSetFixed();
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
        style={{ fontSize: '9px' }}
      >{`r-${score.row_score} c-${score.col_score} p-${score.pass_score}`}</div>
    );

  if (fixedState) {
    return (
      <div
        className="num_box"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <input type="checkbox" onChange={onChange} checked={fixedValue} />
        {number}
      </div>
    );
  }
  return <div className="num_box">{number}</div>;
}

function Seat({ seat }) {
  const [edit, setEdit] = useContext(EditContext);
  const [selectebls] = useContext(SelectablesContext);
  const [action, setAction] = useContext(ActionsContext);
  const [selectedRC, setSelectedRC] = useContext(SelectedRCcontext);

  const belongs = api.seatBelongs.useData();
  const guests = api.guests.useData();
  const groups = api.guestGroup.useData();
  const tagsBelongs = api.tagBelongs.useData();
  const score = api.seats.useData();

  let score_object;

  if (score.data) {
    score_object = {};
    score.data.forEach((correntSeat) => {
      score_object[seat.id] = correntSeat;
    });
  }

  let guest_id;
  let belong_id;
  let fixed;
  if (belongs.data) {
    const belongs_object = {};
    belongs.data.forEach((belong) => {
      belongs_object[belong.seat] = belong;
    });
    const seat_belong = belongs_object[seat.id];
    guest_id = seat_belong?.guest;
    belong_id = seat_belong?.id;
    if (seat_belong) {
      if (seat_belong.fixed === 0) fixed = false;
      if (seat_belong.fixed === 1) fixed = true;
    }
  }

  let guests_object;
  if (guests.data) {
    guests_object = {};
    guests.data.forEach((guest) => {
      guests_object[guest.id] = guest;
    });
  }

  const guest = guests_object && guest_id ? guests_object[guest_id] : null;

  const guest_name = guest ? `${guest.last_name} ${guest.first_name}` : '';

  const group_color =
    guest && groups.data ? groups.data[guest.guest_group]?.color : undefined;

  const tags = tagsBelongs.data ? tagsBelongs.data[seat.id] : null;

  if (edit === 'ערוך' && selectebls === 'seats') {
    var selectable_class = ' selectable';
    var selected_class =
      (selectedRC.dir === 'row' &&
        selectedRC.number === Number(seat.row_num)) ||
      (selectedRC.dir === 'col' && selectedRC.number === Number(seat.col_num))
        ? ' selected'
        : '';
  } else {
    var selectable_class = '';
    var selected_class = '';
  }

  if (seat.in_group && action === 'groups' && edit === 'ערוך')
    var selectable_class = '';

  const class_name = `seat${selectable_class}${selected_class}`;

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
