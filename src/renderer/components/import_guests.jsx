/* eslint-disable react/jsx-no-bind */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable camelcase */
/* eslint-disable import/no-cycle */
import { useState } from 'react';
import readXlsxFile from 'read-excel-file';
import api from 'renderer/api/api';
import HiveButton from '../hive_elements/hive_button';
import PopUp from '../hive_elements/pop_up';

function ColFild({ ColName, colIndex, setCheck }) {
  function onChange() {
    setCheck((check) => {
      const newCheck = [...check];
      const idIndex = check.indexOf(colIndex);
      if (idIndex !== -1) {
        newCheck.splice(idIndex, 1);
      } else {
        newCheck.push(colIndex);
      }
      return newCheck;
    });
  }
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <input type="checkbox" onChange={onChange} />
      {`ייבא ${ColName} | טור מספר: ${colIndex}`}
    </div>
  );
}

function ImportGuests(props) {
  const [file, setFile] = useState();
  const [check, setCheck] = useState([]);
  const [importSeatNumber] = useState();
  const [importIdNumber] = useState();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [dabuls, setDabuls] = useState(false);
  const create_guests = api.guests.useCreate();
  const [showGroupsSelect, setShowGroupsSelect] = useState(true);

  function onChange(event) {
    setFile(event.target.files[0]);
  }

  async function onClick() {
    const rows = await readXlsxFile(file);
    create_guests({
      guestsData: rows,
      importSeatNumber,
      importIdNumber,
      check_list: JSON.stringify(check),
      dabuls,
    });
    props.setState(false);
  }

  function render_filds() {
    return (
      <>
        <ColFild ColName="תעודת זהות" colIndex={0} setCheck={setCheck} />
        <ColFild ColName="פעיל" colIndex={1} setCheck={setCheck} />
        <ColFild ColName="שם פרטי" colIndex={2} setCheck={setCheck} />
        <ColFild ColName="שם משפחה" colIndex={3} setCheck={setCheck} />
        <ColFild ColName="מספר כיסא" colIndex={4} setCheck={setCheck} />
        <ColFild ColName="קבוצה" colIndex={5} setCheck={setCheck} />
        <ColFild ColName="בקשה 1" colIndex={6} setCheck={setCheck} />
        <ColFild ColName="בקשה 2" colIndex={7} setCheck={setCheck} />
        <ColFild ColName="בקשה 3" colIndex={8} setCheck={setCheck} />
        <ColFild ColName="כמות" colIndex={9} setCheck={setCheck} />
        <ColFild ColName="הערות" colIndex={10} setCheck={setCheck} />
        <ColFild ColName="מספר טלפון" colIndex={11} setCheck={setCheck} />
      </>
    );
  }
  const groupsAllIds = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  return (
    <PopUp status={props.status} setState={props.setState} title="יבא">
      <form id="import_guests_form">
        <h2> ייבא שמות </h2>
        <label> בחר קובץ אקסאל </label>
        <br />
        <input onChange={onChange} type="file" accept=".xls,.xlsx" />
        <br />
        {/* <input type="checkbox" onChange={() => setDabuls(!dabuls)} /> */}
        <HiveButton
          onClick={() => {
            if (groupsAllIds) {
              if (showGroupsSelect) {
                setCheck(groupsAllIds);
                setShowGroupsSelect(false);
              } else {
                setCheck([]);
                setShowGroupsSelect(true);
              }
            }
          }}
          active={!showGroupsSelect}
        >
          {' '}
          בחר הכל{' '}
        </HiveButton>
        {showGroupsSelect ? render_filds() : ''}
        <br />
        <HiveButton onClick={onClick}> ייבא </HiveButton>
      </form>
    </PopUp>
  );
}

export default ImportGuests;
