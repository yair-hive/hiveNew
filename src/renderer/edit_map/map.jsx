/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/tabindex-no-positive */
/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable react/jsx-no-constructed-context-values */
/* eslint-disable consistent-return */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable import/no-cycle */
/* eslint-disable react/prop-types */
/* eslint-disable camelcase */
/* eslint-disable react-hooks/exhaustive-deps */
// import SelectionArea from '@viselect/react'
import SelectionArea, { useSelection } from 'hive-select';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from 'renderer/api/api';
import { useHive } from '../app_hooks';
import {
  ActionsContext,
  EditContext,
  MBloaderContext,
  FixedContext,
} from '../app';
import Cell from './cell';
import './map_cont.css';
import '../style/side_menu.css';
import MBloader from '../hive_elements/MBloader';
import { map_add_presers } from './map_add_presers';
import { map_delete_presers } from './map_delete_presers';
// import MapAdd from './mapAddHook';
import Prompt from '../hive_elements/Prompt';

export const DropContext = React.createContext(null);
export const SelectedContext = React.createContext(null);
export const SelectedRCcontext = React.createContext(null);

function MapSelection({ children }) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [MBloaderStatus, setMBloaderStatus] = useContext(MBloaderContext);

  let className = 'selection_bond main_bord';
  if (MBloaderStatus !== 0 && MBloaderStatus !== 100) {
    const mb = document.getElementsByClassName('selection_bond')[0];
    mb.scrollTop = 0;
    mb.scrollLeft = 0;
    className += ' in_of';
  }

  function onStart({ event, selection }) {
    if (!event.ctrlKey && !event.metaKey) {
      selection.clearSelection();
      document
        .querySelectorAll('.selected')
        .forEach((e) => e.classList.remove('selected'));
    }
  }
  function onMove({
    store: {
      changed: { added, removed },
    },
  }) {
    added.forEach((ele) => ele.classList.add('selected'));
    removed.forEach((ele) => ele.classList.remove('selected'));
  }
  return (
    <SelectionArea
      selectables=".selectable"
      onStart={onStart}
      onMove={onMove}
      behaviour={{ scrolling: { startScrollMargins: { x: 150, y: 0 } } }}
      className={className}
    >
      {children}
    </SelectionArea>
  );
}

function MapBody() {
  const [fixedState] = useContext(FixedContext);
  const map = api.maps.useData();
  const seats = api.seats.useData();
  const elements = api.mapElements.useData();
  const seats_groups = api.seatsGroups.useData();
  const selection = useSelection();
  const Hive = useHive();

  function getSelectedBounds() {
    const selected = selection.getSelection();
    const rows = [];
    const cols = [];
    for (const cell of selected) {
      const row = Number(cell.getAttribute('cell-row'));
      const col = Number(cell.getAttribute('cell-col'));
      if (rows.indexOf(row) === -1) rows.push(row);
      if (cols.indexOf(col) === -1) cols.push(col);
    }
    cols.sort((a, b) => {
      return a - b;
    });
    rows.sort((a, b) => {
      return a - b;
    });
    const from_row = rows[0];
    const from_col = cols[0];
    const to_row = rows[rows.length - 1];
    const to_col = cols[cols.length - 1];
    const data = {
      from_row,
      from_col,
      to_row,
      to_col,
    };
    return data;
  }

  const [tagNameToAdd, setTagNameToAdd] = useState();
  const [seatNumberToAdd, setSeatNumberToAdd] = useState();
  const [elementNameToAdd, setElementNameToAdd] = useState();
  const [groupNameToAdd, setGroupToAdd] = useState();
  const [selected_seat, setSelectedSeat] = useState(null);
  const [selectedRC, setSelectedRC] = useState({});
  // const [addStatus, setAddStatus] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [action, setAction] = useContext(ActionsContext);

  const [dropDownPos, setDropDownPos] = useState(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [edit, setEdit] = useContext(EditContext);

  const seats_create = api.seats.useCreate();
  const tags_create = api.tagBelongs.useCreate();
  const numbers_update = api.seats.useUpdate().numbers;
  const elements_create = api.mapElements.useCreate();
  const groups_create = api.seatsGroups.useCreate();
  const setFixedAll = api.seatBelongs.useSetFixedAll();
  const map_update = api.maps.useUpdate();

  const seats_delete = api.seats.useDelete();
  const elements_delete = api.mapElements.useDelete();
  const groups_delete = api.seatsGroups.useDelete();

  function getSelectedIds() {
    const selected = selection.getSelection();
    const seats = [];
    for (let i = 0; i < selected.length; i++) {
      const seat = selected[i];
      const seat_id = seat.getAttribute('seat_id');
      seats.push(seat_id);
    }
    return seats;
  }

  function setFixed(value) {
    function getBelongIds() {
      const selected = selection.getSelection();
      const seatsBelongs = [];
      for (let i = 0; i < selected.length; i++) {
        const seat = selected[i];
        const seatBelong = seat.getAttribute('belong_id');
        if (seatBelong.length > 0) seatsBelongs.push(seatBelong);
      }
      return seatsBelongs;
    }
    setFixedAll({ belongIds: JSON.stringify(getBelongIds()), value });
  }

  useEffect(() => {
    async function action() {
      if (tagNameToAdd) {
        const selectedSeats = getSelectedIds();
        await tags_create({ seats: selectedSeats, tag_name: tagNameToAdd });
        setTagNameToAdd(false);
      }
    }
    action();
  }, [tagNameToAdd]);
  useEffect(() => {
    async function action() {
      if (elementNameToAdd) {
        const selectedBounds = getSelectedBounds();
        await elements_create({
          element_name: elementNameToAdd,
          ...selectedBounds,
        });
        setElementNameToAdd(false);
      }
    }
    action();
  }, [elementNameToAdd]);
  useEffect(() => {
    async function action() {
      if (groupNameToAdd) {
        const selectedBounds = getSelectedBounds();
        await groups_create({ group_name: groupNameToAdd, ...selectedBounds });
        setGroupToAdd(false);
      }
    }
    action();
  }, [groupNameToAdd]);
  useEffect(() => {
    async function action() {
      if (seatNumberToAdd) {
        const col_name = seatNumberToAdd;
        let seatNumber = Number(col_name) + 1;
        const elements = selection.getSelection();
        const data = [];
        for (const element of elements) {
          const seat_id = element.getAttribute('seat_id');
          data.push({ id: seat_id, number: seatNumber });
          seatNumber++;
        }
        await numbers_update({ data });
        setSeatNumberToAdd(false);
      }
    }
    action();
  }, [seatNumberToAdd]);

  if (edit === 'ערוך') {
    if (selection?.enable) selection.enable();
  }
  if (edit === 'אל תערוך' && !fixedState) {
    if (selection?.disable) selection.disable();
  }
  if (fixedState) {
    if (selection?.enable) selection.enable();
  }
  function onMousedown(event) {
    const { classList } = event.target;
    if (
      !event.ctrlKey &&
      !event.metaKey &&
      !classList.contains('hive_button') &&
      !classList.contains('hive_but')
    ) {
      setSelectedRC({});
      if (
        !classList.contains('name_box') &&
        !classList.contains('drop_down') &&
        !classList.contains('rolling-list-item')
      ) {
        setDropDownPos(false);
      }
    }
    if (event.keyCode !== 13) {
      if (
        !event.ctrlKey &&
        !event.metaKey &&
        !classList.contains('hive_button')
      ) {
        if (!event.target.classList.contains('cell')) {
          document
            .querySelectorAll('.selected')
            .forEach((e) => e.classList.remove('selected'));
        }
      }
    }
  }

  function map_add() {
    if (selectedRC.dir) {
      if (selectedRC.dir === 'row') {
        map_update.add_row({ row: selectedRC.number });
      }
      if (selectedRC.dir === 'col') {
        map_update.add_col({ col: selectedRC.number });
      }
      return;
    }
    if (action === 'tags') {
      if (Hive.pop_ups.hive_super) {
        Hive.closePopUp('hive_super');
      } else Hive.openPopUp('hive_super');
      return;
    }
    if (action === 'numbers') {
      if (Hive.pop_ups.add_seat_number) Hive.closePopUp('add_seat_number');
      else Hive.openPopUp('add_seat_number');
      return;
    }
    if (action === 'elements') {
      if (Hive.pop_ups.add_element) Hive.closePopUp('add_element');
      else Hive.openPopUp('add_element');
      return;
    }
    if (action === 'groups') {
      if (Hive.pop_ups.add_area) Hive.closePopUp('add_area');
      else Hive.openPopUp('add_area');
      return;
    }
    const mutations = {
      seats: seats_create,
      tags: tags_create,
      numbers: numbers_update,
      elements: elements_create,
      groups: groups_create,
    };
    return mutations[action](map_add_presers[action]());
  }
  function map_delete() {
    if (selectedRC.dir) {
      if (selectedRC.dir === 'row') {
        map_update.delete_row({ row: selectedRC.number });
      }
      if (selectedRC.dir === 'col') {
        map_update.delete_col({ col: selectedRC.number });
      }
      return;
    }
    const mutations = {
      seats: seats_delete,
      elements: elements_delete,
      groups: groups_delete,
    };
    return mutations[action](map_delete_presers[action]());
  }
  function onKeyDown(event) {
    if (edit === 'ערוך') {
      if (event.code === 'Enter') map_add();
      if (event.code === 'Delete') map_delete();
    }
    if (fixedState) {
      if (event.code === 'Enter') setFixed(true);
      if (event.code === 'Delete') setFixed(false);
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', onMousedown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onMousedown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [action, selectedRC]);

  function render_cells() {
    const cells_elements = [];
    const list = [];
    const RCindex = [];
    if (map.data) {
      let i = 0;
      for (let row = 0; row <= map.data.rows_number; row++) {
        RCindex[row] = [];
        if (row !== 0) {
          for (let col = 0; col <= map.data.columns_number; col++) {
            if (col !== 0) {
              RCindex[row][col] = i;
              list[i] = {
                row,
                col,
                type: 'plase_holder',
              };
              i++;
            } else {
              RCindex[row][col] = i;
              list[i] = {
                row,
                col,
                dir: 'row',
                type: 'RC',
              };
              i++;
            }
          }
        } else {
          for (let col = 0; col <= map.data.columns_number; col++) {
            RCindex[row][col] = i;
            list[i] = {
              row,
              col,
              dir: 'col',
              type: 'RC',
            };
            i++;
          }
        }
      }
    }
    if (map.data && seats.data) {
      const seats_array = Object.entries(seats.data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for (const [key, seat] of seats_array) {
        if (seat) {
          try {
            const cell = list[RCindex[seat.row_num][seat.col_num]];
            list[RCindex[seat.row_num][seat.col_num]] = {
              ...seat,
              ...cell,
              type: 'seat',
            };
          } catch (error) {
            // eslint-disable-next-line no-console
            console.log(error);
          }
        }
      }
    }
    if (map.data && elements.data) {
      for (const element of elements.data) {
        for (let row = element.from_row; row <= element.to_row; row++) {
          for (let col = element.from_col; col <= element.to_col; col++) {
            list[RCindex[row][col]] = null;
          }
        }
        list[RCindex[element.from_row][element.from_col]] = {
          ...element,
          type: 'element',
        };
      }
    }
    if (map.data && seats_groups.data) {
      for (const group of seats_groups.data) {
        group.from_row = Number(group.from_row);
        group.from_col = Number(group.from_col);
        group.to_row = Number(group.to_row);
        group.to_col = Number(group.to_col);
        for (let row = group.from_row; row <= group.to_row; row++) {
          for (let col = group.from_col; col <= group.to_col; col++) {
            const cell = list[RCindex[row][col]];
            list[RCindex[row][col]] = { ...cell, in_group: true };
          }
        }
      }
    }
    let i = 0;
    for (const cell of list) {
      cells_elements.push(<Cell cell={cell} key={i} />);
      i++;
    }
    return cells_elements;
  }

  function render_areas() {
    const list = [];
    const cells_elements = [];
    if (map.data && seats_groups.data) {
      for (const group of seats_groups.data) {
        list.push({ ...group, type: 'group' });
      }
    }
    let i = 0;
    for (const cell of list) {
      cells_elements.push(<Cell cell={cell} key={i} />);
      i++;
    }
    return cells_elements;
  }

  function selected_rc() {
    let from_col;
    let to_col;
    let from_row;
    let to_row = Number(0);
    if (selectedRC.dir === 'row') {
      from_col = 2;
      to_col = Number(map.data?.columns_number) + 2;
      from_row = Number(selectedRC.number) + 1;
      to_row = Number(selectedRC.number) + 1;
    }

    if (selectedRC.dir === 'col') {
      from_col = Number(selectedRC.number) + 1;
      to_col = Number(selectedRC.number) + 1;
      from_row = 2;
      to_row = Number(map.data?.rows_number) + 2;
    }

    if (!selectedRC.dir) return;

    return (
      <div
        className="selected_rc"
        style={{
          gridRowStart: from_row,
          gridColumnStart: from_col,
          gridRowEnd: to_row,
          gridColumnEnd: to_col,
        }}
      />
    );
  }

  let STYLE;
  if (edit === 'אל תערוך') {
    STYLE = {
      '--map-rows': map.data?.rows_number,
      '--map-cols': map.data?.columns_number,
    };
  }
  if (edit === 'ערוך') {
    STYLE = {
      '--map-rows': Number(map.data?.rows_number) + 1,
      '--map-cols': Number(map.data?.columns_number) + 1,
    };
  }

  let mapScale = 1;

  return (
    <>
      <MBloader />
      <div
        className="map_container"
        tabIndex={1}
        onKeyDown={(event) => {
          if (event.ctrlKey) {
            if (event.code === 'Minus') mapScale -= 0.004;
            if (event.code === 'Equal') mapScale += 0.004;
            event.target.style.transform = `scale(${mapScale})`;
          }
        }}
      >
        <Prompt id="add_tags_p" title="הוסף תגיות" setValue={setTagNameToAdd} />
        <Prompt id="hive_super" title="הוסף תגיות" setValue={setTagNameToAdd} />
        <Prompt
          id="add_seat_number"
          title="הסף מספרי כיסאות"
          setValue={setSeatNumberToAdd}
        />
        <Prompt
          id="add_element"
          title="הוסף אלמנט"
          setValue={setElementNameToAdd}
        />
        <Prompt id="add_area" title="הוסף איזור" setValue={setGroupToAdd} />
        <SelectedRCcontext.Provider value={[selectedRC, setSelectedRC]}>
          <SelectedContext.Provider value={[selected_seat, setSelectedSeat]}>
            <DropContext.Provider value={[dropDownPos, setDropDownPos]}>
              {/* <AddGuestDropDown/> */}
              {/* <MapAdd open={addStatus} setOpen={setAddStatus} /> */}
              <div className="map_overlay" style={STYLE}>
                {render_areas()}
                {selected_rc()}
              </div>
              <div id="map" className="map" style={STYLE}>
                {render_cells()}
              </div>
            </DropContext.Provider>
          </SelectedContext.Provider>
        </SelectedRCcontext.Provider>
      </div>
    </>
  );
}

function Map() {
  const { map_name, project_name } = useParams();

  if (!map_name)
    return (
      <div
        className="main_bord"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          zIndex: 100,
        }}
      >
        <h1>{project_name}</h1>
      </div>
    );

  return (
    // <div style={{ overflow: "hidden" }}>
    // <MapNav />
    <MapSelection>
      <MapBody />
    </MapSelection>
    // </div>
  );
}

export default Map;
