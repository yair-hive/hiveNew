/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-plusplus */
/* eslint-disable no-restricted-syntax */
/* eslint-disable consistent-return */
/* eslint-disable camelcase */
/* eslint-disable import/no-cycle */
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from 'renderer/api/api';
import HiveButton from '../hive_elements/hive_button';
import HiveSwitch from '../hive_elements/hive_switch';
import { ActionsContext, SelectablesContext, EditContext } from '../app';
import '../style/side_menu.css';
import TagsPop from './tags_pop';
import ProjectSM from '../pages/projects_sub_menu';
import { map_add_presers } from './map_add_presers';
import { map_delete_presers } from './map_delete_presers';

function ProjectSideMenu() {
  const navigate = useNavigate();
  const { map_name, project_name } = useParams();

  const [mapState, setMap] = useState(null);
  const maps = api.maps.useDataAll();

  const mapsOptions = maps.data?.map((map) => map.map_name);

  useEffect(() => {
    if (mapState) navigate(`/maps/${project_name}/${mapState}`);
  }, [mapState, navigate, project_name]);

  return (
    <>
      <HiveSwitch
        options={mapsOptions}
        active={map_name}
        setActive={setMap}
        bordKey="KeyQ"
      />
      <ProjectSM />
    </>
  );
}

function ColsToSwitch() {
  const [colsTo, setColsTo] = useState(undefined);

  const update_cols_to = api.maps.useUpdate().cols_to;

  const map = api.maps.useData();

  useEffect(() => {
    if (colsTo) update_cols_to({ to: colsTo });
  }, [colsTo, update_cols_to]);

  return (
    <HiveSwitch
      active={map.data?.cols_to}
      options={[
        { name: 'שמאל', value: 'left' },
        { name: 'מרכז', value: 'center' },
        { name: 'ימין', value: 'right' },
      ]}
      setActive={setColsTo}
    />
  );
}
function ChangeMapName() {
  const { map_name, project_name } = useParams();
  const [new_name, setNewName] = useState(map_name);

  useEffect(() => setNewName(map_name), [map_name]);

  const navigate = useNavigate();

  const update_map = api.maps.useUpdate().map_name;

  function onChange(e) {
    setNewName(e.target.value);
  }
  async function onBlur() {
    update_map({ new_name });
    navigate(`/maps/${project_name}/${new_name}`);
  }

  return <input onChange={onChange} onBlur={onBlur} value={new_name} />;
}
function SearchGuest() {
  const [input_str, setInputStr] = useState('');

  const map = api.maps.useData();
  const seats = api.seats.useDataAll();
  const belongs = api.seatBelongs.useData();
  const guests = api.guests.useData();
  const groups = api.guestGroup.useData();

  function guestsList() {
    function createMatchList(guests_data) {
      const match_list = [];
      const search_str = `^${input_str}`;
      if (input_str.length !== 0) {
        const search_reg = new RegExp(search_str);
        for (const corrent of guests_data) {
          if (search_reg.test(corrent.name)) {
            match_list.push(corrent);
          }
        }
      }
      return match_list;
    }

    if (map.data && seats.data && belongs.data && guests.data && groups.data) {
      const belongs_object = {};
      const seats_object = {};
      belongs.data.forEach((belong) => {
        belongs_object[belong.guest] = belong;
      });
      seats.data.forEach((seat) => {
        seats_object[seat.id] = seat;
      });
      const guests_with_belong = [];
      for (const guest of guests.data) {
        let seat = belongs_object[guest.id];
        if (seat) {
          seat = seat.seat;
          const seat_number = seats_object[seat]?.seat_number;
          guest.group_id = guest.guest_group;
          guest.group_name = groups.data[guest.group_id].group_name;
          guest.name = `${guest.last_name} ${guest.first_name}`;
          guest.seat_number = seat_number;
          guests_with_belong.push(guest);
        }
      }
      const matchList = createMatchList(guests_with_belong);
      const elements_list = [];
      let i = 0;
      for (const match of matchList) {
        i++;
        const match_element = (
          <li key={i}>
            <span>{match.name}</span>
            <span>
              <span className="seat_number">{`| ${match.seat_number} | `}</span>
              <span className="guest_group">{match.group_name}</span>
            </span>
          </li>
        );
        elements_list.push(match_element);
      }
      return elements_list;
    }
  }

  function onInput(event) {
    setInputStr(event.target.value);
  }

  return (
    <>
      <input type="text" onInput={onInput} />
      <ul
        className="results"
        dir="rtl"
        style={{
          backgroundColor: 'gray',
        }}
      >
        {guestsList()}
      </ul>
    </>
  );
}
function MapSideMenu() {
  const navigate = useNavigate();
  const { map_name, project_name } = useParams();
  const [edit, setEdit] = useContext(EditContext);

  const [mapState, setMap] = useState(null);
  const maps = api.maps.useDataAll();

  const mapsOptions = maps.data?.map((map) => map.map_name);

  useEffect(() => {
    if (mapState) navigate(`/maps/${project_name}/${mapState}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapState, project_name]);

  const seats_create = api.seats.useCreate();
  const tags_create = api.tagBelongs.useCreate();
  const numbers_update = api.seats.useUpdate().numbers;
  const elements_create = api.mapElements.useCreate();
  const groups_create = api.seatsGroups.useCreate();

  const seats_delete = api.seats.useDelete();
  const elements_delete = api.mapElements.useDelete();

  const [tagsPopStatus, setTagsPopStatus] = useState(false);

  const selecteblsState = useContext(SelectablesContext);
  const [action, setAction] = useContext(ActionsContext);

  function map_delete() {
    const mutations = {
      seats: seats_delete,
      elements: elements_delete,
    };
    return mutations[action](map_delete_presers[action]());
  }

  function map_add() {
    const mutations = {
      seats: seats_create,
      tags: tags_create,
      numbers: numbers_update,
      elements: elements_create,
      groups: groups_create,
    };
    return mutations[action](map_add_presers[action]());
  }

  function selecteblsSwitch() {
    if (selecteblsState) {
      return (
        <HiveSwitch
          options={[
            { value: 'seats', name: 'כיסאות' },
            { value: 'cells', name: 'תאים' },
          ]}
          active="cells"
          setActive={selecteblsState[1]}
          bordKey="KeyX"
        />
      );
    }
  }

  function actionSwitch() {
    if (selecteblsState[0] === 'cells') {
      return (
        <HiveSwitch
          options={[
            { value: 'seats', name: 'כיסאות' },
            { value: 'elements', name: 'אלמנטים' },
          ]}
          active="seats"
          setActive={setAction}
          bordKey="KeyB"
        />
      );
    }
    if (selecteblsState[0] === 'seats') {
      return (
        <HiveSwitch
          options={[
            { value: 'numbers', name: 'מספרים' },
            { value: 'tags', name: 'תגיות' },
            { value: 'seats', name: 'כיסאות' },
            { value: 'groups', name: 'טורים' },
          ]}
          active="numbers"
          setActive={setAction}
          bordKey="KeyB"
        />
      );
    }
  }

  function noEditSubMenu() {
    if (edit === 'אל תערוך') {
      return (
        <div className="sub_menu">
          <SearchGuest />
        </div>
      );
    }
  }
  function editSubMenu() {
    if (edit === 'ערוך') {
      return (
        <div className="sub_menu">
          <ColsToSwitch />
          <ChangeMapName />
          {selecteblsSwitch()}
          {actionSwitch()}
          <HiveButton onClick={() => map_add()}> הוסף </HiveButton>
          <HiveButton onClick={() => map_delete()}> מחק </HiveButton>
          <HiveButton
            onClick={() => {
              setTagsPopStatus(true);
            }}
          >
            {' '}
            תגיות{' '}
          </HiveButton>
          <TagsPop status={tagsPopStatus} setState={setTagsPopStatus} />
        </div>
      );
    }
  }

  return (
    <>
      <HiveSwitch
        options={mapsOptions}
        active={map_name}
        setActive={setMap}
        bordKey="KeyQ"
      />
      <HiveSwitch
        options={['אל תערוך', 'ערוך']}
        active="אל תערוך"
        setActive={setEdit}
        bordKey="KeyQ"
      />
      {editSubMenu()}
      {noEditSubMenu()}
      <ProjectSM />
      <HiveButton onClick={() => window.print()}> הדפס </HiveButton>
    </>
  );
}

function SideMenu() {
  const { map_name } = useParams();
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const contentElement = document.getElementById('content');
    if (!open) contentElement.style.gridTemplateColumns = '99% 1%';
    else contentElement.style.gridTemplateColumns = '78% 22%';
  }, [open]);

  if (!map_name)
    return (
      <div
        className="side_menu"
        style={{ zIndex: 200, padding: open ? '' : '0' }}
      >
        <div
          onClick={() => setOpen(!open)}
          style={{
            position: 'absolute',
            backgroundColor: 'gray',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2px',
            width: '15px',
            height: '15px',
            cursor: 'pointer',
            right: open ? '22%' : '1%',
            zIndex: 450,
            fontSize: '15px',
          }}
        >
          {open ? <span>&#10005;</span> : <span>&#60;</span>}
        </div>
        {open ? <ProjectSideMenu /> : ''}
      </div>
    );
  return (
    <div
      className="side_menu"
      style={{ zIndex: 200, padding: open ? '' : '0' }}
    >
      <div
        onClick={() => setOpen(!open)}
        style={{
          position: 'absolute',
          backgroundColor: 'gray',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2px',
          width: '15px',
          height: '15px',
          cursor: 'pointer',
          right: open ? '22%' : '1%',
          zIndex: 450,
          fontSize: '15px',
        }}
      >
        {open ? <span>&#10005;</span> : <span>&#60;</span>}
      </div>
      {open ? <MapSideMenu /> : ''}
    </div>
  );
}

export default SideMenu;
