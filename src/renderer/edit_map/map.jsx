/* eslint-disable react-hooks/exhaustive-deps */
// import SelectionArea from '@viselect/react'
import SelectionArea, { useSelection } from "hive-select";
import { useContext, useEffect, useState } from "react";
import React from "react";
import { useHive } from "../app_hooks";
import { ActionsContext, EditContext, MBloaderContext } from "../app";
import AddGuestDropDown from "./add_guest_drop_down";
import Cell from "./cell";
import "./map_cont.css";
import "../style/side_menu.css";
import MBloader from "../hive_elements/MBloader";
import {
  useSeatsCreate,
  useSeatsData,
  useSeatsDelete,
  useSeatsUpdate,
} from "../querys/seats";
import { useTagBelongsCreate } from "../querys/tag_belongs";
import {
  useMapElementsCreate,
  useMapElementsData,
  useMapElementsDelete,
} from "../querys/map_elements";
import { map_add_presers } from "./map_add_presers";
import { useMapsData, useMapsUpdate } from "../querys/maps";
import { map_delete_presers } from "./map_delete_presers";
import {
  useSeatsGroupsCreate,
  useSeatsGroupsData,
} from "../querys/seats_groups";
import { useParams } from "react-router-dom";
import Prompt from "../hive_elements/Prompt";

export const DropContext = React.createContext(null);
export const SelectedContext = React.createContext(null);
export const SelectedRCcontext = React.createContext(null);

function MapNav() {
  return <div className="naps-nav"></div>;
}

function MapSelection({ children }) {
  const [MBloaderStatus, setMBloaderStatus] = useContext(MBloaderContext);

  var className = "selection_bond main_bord";
  if (MBloaderStatus !== 0 && MBloaderStatus !== 100) {
    var mb = document.getElementsByClassName("selection_bond")[0];
    mb.scrollTop = 0;
    mb.scrollLeft = 0;
    className += " in_of";
  }

  function onStart({ event, selection }) {
    if (!event.ctrlKey && !event.metaKey) {
      selection.clearSelection();
      document
        .querySelectorAll(".selected")
        .forEach((e) => e.classList.remove("selected"));
    }
  }
  function onMove({
    store: {
      changed: { added, removed },
    },
  }) {
    added.forEach((ele) => ele.classList.add("selected"));
    removed.forEach((ele) => ele.classList.remove("selected"));
  }
  return (
    <SelectionArea
      selectables={".selectable"}
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
  const map = useMapsData();
  const seats = useSeatsData();
  const elements = useMapElementsData();
  const seats_groups = useSeatsGroupsData();

  const Hive = useHive();

  function getSelectedBounds() {
    var selected = selection.getSelection();
    var rows = [];
    var cols = [];
    for (let cell of selected) {
      var row = Number(cell.getAttribute("cell-row"));
      var col = Number(cell.getAttribute("cell-col"));
      if (rows.indexOf(row) === -1) rows.push(row);
      if (cols.indexOf(col) === -1) cols.push(col);
    }
    cols.sort(function (a, b) {
      return a - b;
    });
    rows.sort(function (a, b) {
      return a - b;
    });
    var from_row = rows[0];
    var from_col = cols[0];
    var to_row = rows[rows.length - 1];
    var to_col = cols[cols.length - 1];
    var data = {
      from_row: from_row,
      from_col: from_col,
      to_row: to_row,
      to_col: to_col,
    };
    return data;
  }

  const [tagNameToAdd, setTagNameToAdd] = useState();
  const [seatNumberToAdd, setSeatNumberToAdd] = useState();
  const [elementNameToAdd, setElementNameToAdd] = useState();
  const [groupNameToAdd, setGroupToAdd] = useState();
  const [selected_seat, setSelectedSeat] = useState(null);
  const [selectedRC, setSelectedRC] = useState({});
  const [action, setAction] = useContext(ActionsContext);
  const selection = useSelection();

  const [dropDownPos, setDropDownPos] = useState(null);
  const [edit, setEdit] = useContext(EditContext);

  const seats_create = useSeatsCreate();
  const tags_create = useTagBelongsCreate();
  const numbers_update = useSeatsUpdate().numbers;
  const elements_create = useMapElementsCreate();
  const groups_create = useSeatsGroupsCreate();
  const map_update = useMapsUpdate();

  const seats_delete = useSeatsDelete();
  const elements_delete = useMapElementsDelete();

  function getSelectedIds() {
    var selected = selection.getSelection();
    var seats = [];
    for (let i = 0; i < selected.length; i++) {
      var seat = selected[i];
      var seat_id = seat.getAttribute("seat_id");
      seats.push(seat_id);
    }
    return seats;
  }

  useEffect(() => {
    if (tagNameToAdd) {
      var selectedSeats = getSelectedIds();
      tags_create({ seats: selectedSeats, tag_name: tagNameToAdd });
    }
  }, [tagNameToAdd]);
  useEffect(() => {
    if (elementNameToAdd) {
      var selectedBounds = getSelectedBounds();
      elements_create({
        data: { name: elementNameToAdd, ...selectedBounds },
      });
    }
  }, [elementNameToAdd]);
  useEffect(() => {
    if (groupNameToAdd) {
      var selectedBounds = getSelectedBounds();
      groups_create({
        data: { name: groupNameToAdd, ...selectedBounds },
      });
    }
  }, [groupNameToAdd]);
  useEffect(() => {
    if (seatNumberToAdd) {
      var col_name = seatNumberToAdd;
      var seatNumber = Number(col_name) + 1;
      var elements = selection.getSelection();
      var data = [];
      for (let element of elements) {
        var seat_id = element.getAttribute("seat_id");
        data.push({ id: seat_id, number: seatNumber });
        seatNumber++;
      }
      numbers_update({ data });
    }
  }, [seatNumberToAdd]);

  if (edit === "ערוך") {
    if (selection?.enable) selection.enable();
  }
  if (edit === "אל תערוך") {
    if (selection?.disable) selection.disable();
  }

  function onMousedown(event) {
    var classList = event.target.classList;
    if (
      !event.ctrlKey &&
      !event.metaKey &&
      !classList.contains("hive_button") &&
      !classList.contains("hive_but")
    ) {
      setSelectedRC({});
      if (
        !classList.contains("name_box") &&
        !classList.contains("drop_down") &&
        !classList.contains("rolling-list-item")
      ) {
        setDropDownPos(false);
      }
    }
    if (event.keyCode != 13) {
      var classList = event.target.classList;
      if (
        !event.ctrlKey &&
        !event.metaKey &&
        !classList.contains("hive_button")
      ) {
        if (!event.target.classList.contains("cell")) {
          document
            .querySelectorAll(".selected")
            .forEach((e) => e.classList.remove("selected"));
        }
      }
    }
  }

  function map_add() {
    if (selectedRC.dir) {
      if (selectedRC.dir === "row") {
        map_update.add_row({ row: selectedRC.number });
      }
      if (selectedRC.dir === "col") {
        map_update.add_col({ col: selectedRC.number });
      }
      return;
    }
    if (action == "tags") {
      console.log("psdfgfh");
      Hive.openPopUp("hive_super");
      console.log(Hive.pop_ups);
      return;
    }
    if (action == "numbers") {
      Hive.openPopUp("add_seat_number");
      console.log(Hive.pop_ups);
      return;
    }
    if (action == "elements") {
      Hive.openPopUp("add_element");
      return;
    }
    if (action == "groups") {
      Hive.openPopUp("add_area");
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
      if (selectedRC.dir === "row") {
        map_update.delete_row({ row: selectedRC.number });
      }
      if (selectedRC.dir === "col") {
        map_update.delete_col({ col: selectedRC.number });
      }
      return;
    }
    const mutations = {
      seats: seats_delete,
      elements: elements_delete,
    };
    console.log({ action });
    console.log({ map_delete_presers });
    console.log({ mutations });
    return mutations[action](map_delete_presers[action]());
  }
  function onKeyDown(event) {
    if (edit === "ערוך") {
      if (event.code == "Enter") map_add();
      if (event.code == "Delete") map_delete();
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", onMousedown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onMousedown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [action, selectedRC]);

  function render_cells() {
    var cells_elements = [];
    var list = [];
    var RCindex = [];
    if (map.data) {
      var i = 0;
      for (let row = 0; row <= map.data.rows_number; row++) {
        RCindex[row] = [];
        if (row != 0) {
          for (let col = 0; col <= map.data.columns_number; col++) {
            if (col != 0) {
              RCindex[row][col] = i;
              list[i] = {
                row: row,
                col: col,
                type: "plase_holder",
              };
              i++;
            } else {
              RCindex[row][col] = i;
              list[i] = {
                row: row,
                col: col,
                dir: "row",
                type: "RC",
              };
              i++;
            }
          }
        } else {
          for (let col = 0; col <= map.data.columns_number; col++) {
            RCindex[row][col] = i;
            list[i] = {
              row: row,
              col: col,
              dir: "col",
              type: "RC",
            };
            i++;
          }
        }
      }
    }
    if (map.data && seats.data) {
      var i = 0;
      var seats_array = Object.entries(seats.data);
      for (let [key, seat] of seats_array) {
        if (seat) {
          try {
            var cell = list[RCindex[seat.row_num][seat.col_num]];
            list[RCindex[seat.row_num][seat.col_num]] = {
              ...seat,
              ...cell,
              type: "seat",
            };
          } catch (error) {}
          i++;
        }
      }
    }
    if (map.data && elements.data) {
      for (let element of elements.data) {
        for (let row = element.from_row; row <= element.to_row; row++) {
          for (let col = element.from_col; col <= element.to_col; col++) {
            list[RCindex[row][col]] = null;
          }
        }
        list[RCindex[element.from_row][element.from_col]] = {
          ...element,
          type: "element",
        };
      }
    }
    if (map.data && seats_groups.data) {
      for (let group of seats_groups.data) {
        group.from_row = Number(group.from_row);
        group.from_col = Number(group.from_col);
        group.to_row = Number(group.to_row);
        group.to_col = Number(group.to_col);
        for (let row = group.from_row; row <= group.to_row; row++) {
          for (let col = group.from_col; col <= group.to_col; col++) {
            var cell = list[RCindex[row][col]];
            list[RCindex[row][col]] = { ...cell, in_group: true };
          }
        }
      }
    }
    var i = 0;
    for (let cell of list) {
      cells_elements.push(<Cell cell={cell} key={i} />);
      i++;
    }
    return cells_elements;
  }

  function render_areas() {
    var list = [];
    var cells_elements = [];
    if (map.data && seats_groups.data) {
      for (let group of seats_groups.data) {
        list.push({ ...group, type: "group" });
      }
    }
    var i = 0;
    for (let cell of list) {
      cells_elements.push(<Cell cell={cell} key={i} />);
      i++;
    }
    return cells_elements;
  }

  function selected_rc() {
    var from_col,
      to_col,
      from_row,
      to_row = Number(0);
    if (selectedRC.dir === "row") {
      from_col = 2;
      to_col = Number(map.data?.columns_number) + 2;
      from_row = Number(selectedRC.number) + 1;
      to_row = Number(selectedRC.number) + 1;
    }

    if (selectedRC.dir === "col") {
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

  var STYLE;
  if (edit === "אל תערוך") {
    STYLE = {
      "--map-rows": map.data?.rows_number,
      "--map-cols": map.data?.columns_number,
    };
  }
  if (edit === "ערוך") {
    STYLE = {
      "--map-rows": Number(map.data?.rows_number) + 1,
      "--map-cols": Number(map.data?.columns_number) + 1,
    };
  }

  return (
    <>
      <MBloader />
      <div className="map_container">
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
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
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
