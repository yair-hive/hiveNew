/* eslint-disable promise/catch-or-return */
/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-plusplus */
/* eslint-disable camelcase */
/* eslint-disable no-restricted-syntax */
import { useSelection } from 'hive-select';
import { useContext, useEffect, useState } from 'react';
import { ActionsContext } from 'renderer/App';
import api from 'renderer/api/api';
import { useHive } from 'renderer/app_hooks';
import Prompt from 'renderer/hive_elements/Prompt';

function MapAdd({ open, setOpen }) {
  const selection = useSelection();
  const Hive = useHive();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [action, setAction] = useContext(ActionsContext);

  const [tagNameToAdd, setTagNameToAdd] = useState();
  const [seatNumberToAdd, setSeatNumberToAdd] = useState();
  const [elementNameToAdd, setElementNameToAdd] = useState();
  const [groupNameToAdd, setGroupToAdd] = useState();

  const seats_create = api.seats.useCreate();
  const tags_create = api.tagBelongs.useCreate();
  const numbers_update = api.seats.useUpdate().numbers;
  const elements_create = api.mapElements.useCreate();
  const groups_create = api.seatsGroups.useCreate();

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
  function getSelectedRC() {
    const cells_list = [];
    const selected = selection.getSelection();
    for (const cell of selected) {
      const cell_data = {};
      cell_data.row = cell.getAttribute('cell-row');
      cell_data.col = cell.getAttribute('cell-col');
      cells_list.push(cell_data);
    }
    return cells_list;
  }

  function onMapAdd() {
    if (action === 'tags') Hive.openPopUp('hive_super');
    if (action === 'numbers') Hive.openPopUp('add_seat_number');
    if (action === 'elements') Hive.openPopUp('add_element');
    if (action === 'groups') Hive.openPopUp('add_area');
    if (action === 'seats')
      seats_create(getSelectedRC()).then(() => setOpen(false));
  }

  useEffect(() => {
    if (open) onMapAdd();
  }, [open]);

  useEffect(() => {
    if (tagNameToAdd) {
      const selectedSeats = getSelectedIds();
      tags_create({ seats: selectedSeats, tag_name: tagNameToAdd }).then(() =>
        setOpen(false)
      );
    }
  }, [tagNameToAdd]);
  useEffect(() => {
    if (elementNameToAdd) {
      const selectedBounds = getSelectedBounds();
      elements_create({
        element_name: elementNameToAdd,
        ...selectedBounds,
      }).then(() => setOpen(false));
    }
  }, [elementNameToAdd]);
  useEffect(() => {
    if (groupNameToAdd) {
      const selectedBounds = getSelectedBounds();
      groups_create({ group_name: groupNameToAdd, ...selectedBounds }).then(
        () => setOpen(false)
      );
    }
  }, [groupNameToAdd]);
  useEffect(() => {
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
      numbers_update({ data }).then(() => setOpen(false));
    }
  }, [seatNumberToAdd]);

  return (
    <>
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
    </>
  );
}

export default MapAdd;
