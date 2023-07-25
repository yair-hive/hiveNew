/* eslint-disable import/no-cycle */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState } from 'react';
import api from 'renderer/api/api';
import { useHive } from 'renderer/app_hooks';
import HiveButton from 'renderer/hive_elements/hive_button';
import PopUp from 'renderer/hive_elements/pop_up';

function ImportProjectPopUp() {
  const [file, setFile] = useState();
  const [name, setName] = useState();
  const hive = useHive();
  const importAction = api.projects.useImport();

  async function onFileChange(event) {
    const TEST = await event.target.files[0];
    const view = new FileReader();
    view.readAsText(TEST);
    view.onload = (ev) => {
      setFile(ev.target.result);
    };
  }

  function onNameChange(event) {
    setName(event.target.value);
  }

  async function onClick() {
    await importAction({ name, file });
    hive.closePopUp('ImportProjectPopUp');
  }

  return (
    <PopUp id="ImportProjectPopUp" title="ייבא פרוייקט">
      <form>
        <label> הכנס שם </label>
        <br />
        <input type="text" onChange={onNameChange} />
        <br />
        <label> בחר קובץ </label>
        <br />
        <input onChange={onFileChange} type="file" accept=".json" />
        <br />
        <HiveButton onClick={onClick}> ייבא </HiveButton>
      </form>
    </PopUp>
  );
}

export default ImportProjectPopUp;
