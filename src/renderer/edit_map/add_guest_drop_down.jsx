/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-restricted-syntax */
/* eslint-disable camelcase */
/* eslint-disable import/no-cycle */
import { useContext, useEffect, useState } from 'react';
import api from 'renderer/api/api';
import DropDown from '../hive_elements/dropDown';
import RolligList from '../hive_elements/rolling_list';
import InputBox from './input_box';
import { DropContext, SelectedContext } from './map';

function AddGuestDropDown() {
  const guests = api.guests.useData();

  const [inputStr, setInputStr] = useState('');
  const add_guest = api.seatBelongs.useCreate();
  const [dropDownPos, setDropDownPos] = useContext(DropContext);
  const [selected_seat, setSelectedSeat] = useContext(SelectedContext);

  useEffect(() => setInputStr(''), [dropDownPos]);

  async function onItem(item) {
    add_guest({
      guest_id: item.value,
      seat_id: selected_seat,
    });
    setDropDownPos(null);
    setSelectedSeat(null);
  }

  function createMatchList() {
    const match_list = [];
    if (inputStr.length !== 0) {
      const search_reg = new RegExp(`^${inputStr}`);
      const guest_array = Object.entries(guests.data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for (const [index, corrent] of guest_array) {
        corrent.name = `${corrent.last_name} ${corrent.first_name}`;
        if (search_reg.test(corrent.name)) {
          match_list.push({ name: corrent.name, value: corrent.id });
        }
      }
    }
    return match_list;
  }

  return (
    <>
      <InputBox pos={dropDownPos} setInputStr={setInputStr} />
      <DropDown pos={dropDownPos}>
        <RolligList items={createMatchList()} onItemClick={onItem} />
      </DropDown>
    </>
  );
}

export default AddGuestDropDown;
