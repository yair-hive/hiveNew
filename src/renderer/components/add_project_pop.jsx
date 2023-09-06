/* eslint-disable import/no-cycle */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable camelcase */
/* eslint-disable react/prop-types */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from 'renderer/api/api';
import HiveButton from '../hive_elements/hive_button';
import PopUp from '../hive_elements/pop_up';
import { useHive } from '../app_hooks';

function AddProjectPop({ id }) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const create_project = api.projects.useCreate();
  const navigate = useNavigate();
  const hive = useHive();

  async function onClick() {
    await create_project({ name, password });
    navigate(`/maps/${name}`);
    hive.closePopUp(id);
  }

  return (
    <PopUp id={id} title="הוסף פרוייקט">
      <form id="create_map_form">
        <br />
        <input type="text" onInput={(e) => setName(e.target.value)} />
        <label> שם הפרוייקט </label>
        <br />
        <input type="text" onInput={(e) => setPassword(e.target.value)} />
        <label> סיסמה </label>
        <br />
        <HiveButton onClick={onClick}> צור </HiveButton>
      </form>
    </PopUp>
  );
}

export default AddProjectPop;
