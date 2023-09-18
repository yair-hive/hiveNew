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

function ImportGuests(props) {
  const [file, setFile] = useState();
  const [importSeatNumber, setImportSeatNumber] = useState();
  const [importIdNumber, setImportIdNumber] = useState();
  const create_guests = api.guests.useCreate();

  function onChange(event) {
    setFile(event.target.files[0]);
  }

  async function onClick() {
    const rows = await readXlsxFile(file);
    create_guests({ guestsData: rows, importSeatNumber, importIdNumber });
    props.setState(false);
  }

  return (
    <PopUp status={props.status} setState={props.setState} title="יבא">
      <form id="import_guests_form">
        <h2> ייבא בחורים </h2>
        <label> בחר קובץ אקסאל </label>
        <br />
        <input onChange={onChange} type="file" accept=".xls,.xlsx" />
        <br />
        <input
          name="importSeatNumber"
          type="checkbox"
          onChange={() => setImportSeatNumber(!importSeatNumber)}
        />
        <label htmlFor="importSeatNumbeer"> ייבא מספרי כיסאות </label>
        <br />
        <input
          name="importIdNumber"
          type="checkbox"
          onChange={() => setImportIdNumber(!importIdNumber)}
        />
        <label htmlFor="importIdNumbeer"> ייבא מספרי תעודת זהות </label>
        <br />
        <HiveButton onClick={onClick}> ייבא </HiveButton>
      </form>
    </PopUp>
  );
}

export default ImportGuests;
