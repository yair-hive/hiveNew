/* eslint-disable no-alert */
/* eslint-disable no-plusplus */
/* eslint-disable no-restricted-syntax */
/* eslint-disable camelcase */
/* eslint-disable import/prefer-default-export */
export const map_add_presers = {
  seats() {
    const cells_list = [];
    const selected = document.querySelectorAll('.selected');
    for (const cell of selected) {
      const cell_data = {};
      cell_data.row = cell.getAttribute('cell-row');
      cell_data.col = cell.getAttribute('cell-col');
      cells_list.push(cell_data);
    }
    return cells_list;
  },
  elements() {
    const selected = document.querySelectorAll('.selected');
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
    const name = prompt('הכנס שם');
    const from_row = rows[0];
    const from_col = cols[0];
    const to_row = rows[rows.length - 1];
    const to_col = cols[cols.length - 1];
    const data = {
      name,
      from_row,
      from_col,
      to_row,
      to_col,
    };
    return { data };
  },
  groups() {
    const selected = document.querySelectorAll('.selected');
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
    const name = prompt('הכנס שם');
    const from_row = rows[0];
    const from_col = cols[0];
    const to_row = rows[rows.length - 1];
    const to_col = cols[cols.length - 1];
    const data = {
      name,
      from_row,
      from_col,
      to_row,
      to_col,
    };
    return { data };
  },
  numbers() {
    const col_name = prompt('Please enter number');
    let seatNumber = Number(col_name) + 1;
    const elements = document.querySelectorAll('.selected');
    const data = [];
    for (const element of elements) {
      const seat_id = element.getAttribute('seat_id');
      data.push({ id: seat_id, number: seatNumber });
      seatNumber++;
    }
    return { data };
  },
  tags() {
    const selected = document.querySelectorAll('.selected');
    const tag_name = prompt('הכנס שם תווית');
    const seats = [];
    for (let i = 0; i < selected.length; i++) {
      const seat = selected[i];
      const seat_id = seat.getAttribute('seat_id');
      seats.push(seat_id);
    }
    return { seats, tag_name };
  },
};
