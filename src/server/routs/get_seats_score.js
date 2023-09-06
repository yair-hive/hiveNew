/* eslint-disable no-restricted-syntax */
/* eslint-disable no-plusplus */
/* eslint-disable no-loop-func */
/* eslint-disable no-return-assign */
/* eslint-disable camelcase */
import con from '../db/mysql/connction.js';

function row_score(seats) {
  const rows = [];

  seats.forEach((seat) => {
    if (rows.indexOf(seat.row_num) === -1) rows.push(seat.row_num);
  });

  rows.sort((a, b) => {
    return a - b;
  });
  rows.reverse();

  const seats_by_row = {};
  rows.forEach((row) => (seats_by_row[row.toString()] = []));
  seats.forEach((seat, index) => seats_by_row[seat.row_num].push(index));

  let i = 0;
  for (const row of rows) {
    i++;
    seats_by_row[row].forEach((index) => {
      seats[index].row_score = i;
    });
  }
  return seats;
}
function col_score(seats, map) {
  const cols = [];

  seats.forEach((seat) => {
    if (cols.indexOf(seat.col_num) === -1) cols.push(seat.col_num);
  });
  cols.sort((a, b) => {
    return a - b;
  });

  map.columns_number = Number(map.columns_number);
  const to = map.cols_to;
  const cols_even = Math.round(cols.length / 2) === Math.floor(cols.length / 2);
  const cols_middle = Math.round(cols.length / 2);

  const seats_by_col = {};
  cols.forEach((col) => (seats_by_col[col.toString()] = []));
  seats.forEach((seat, index) => seats_by_col[seat.col_num].push(index));

  let i = 0;
  let n = 0;
  if (to === 'center') {
    cols.reverse();
    for (const col of cols) {
      n++;
      if (cols_even) {
        if (n != cols_middle + 1) {
          if (n < cols_middle) i++;
          if (n > cols_middle) i--;
        }
        if (n == cols_middle) i++;
        score = Math.abs(i);
      } else {
        if (n > cols_middle) i--;
        if (n < cols_middle) i++;
        if (n == cols_middle) i++;
        score = i;
        if (n == cols_middle) score = Math.abs(i);
      }
      seats_by_col[col].forEach((index) => {
        seats[index].col_score = score;
      });
    }
  }
  if (to === 'left') {
    cols.reverse();
    var score = 0;
    for (const col of cols) {
      score++;
      seats_by_col[col].forEach((index) => {
        seats[index].col_score = score;
      });
    }
  }
  if (to === 'right') {
    var score = 0;
    for (const col of cols) {
      score++;
      seats_by_col[col].forEach((index) => {
        seats[index].col_score = score;
      });
    }
  }
  return seats;
}
function group_score(seats, groups) {
  const seats_as_object = {};
  seats.forEach((seat) => (seats_as_object[seat.id] = seat));

  for (const group of groups) {
    const cols = [];
    for (let i = group.from_col; i <= group.to_col; i++) {
      cols.push(i);
    }
    var group_seats = [];
    for (const seat of seats) {
      if (
        seat.col_num >= group.from_col &&
        seat.col_num <= group.to_col &&
        seat.row_num >= group.from_row &&
        seat.row_num <= group.to_row
      ) {
        group_seats.push(seat);
      }
    }

    var seats_by_col = {};
    cols.forEach((col) => (seats_by_col[col.toString()] = []));
    group_seats.forEach((seat, index) =>
      seats_by_col[seat.col_num].push(index)
    );

    cols.sort(function (a, b) {
      return a - b;
    });

    var score = 20;
    const mid = Math.floor((cols[0] + cols[cols.length - 1]) / 2);
    const as = (cols.length / 2) % 1 != 0;
    for (const col of cols) {
      seats_by_col[col].forEach((index) => {
        const seat_id = group_seats[index].id;
        seats_as_object[seat_id].pass_score = score;
      });
      if (col < mid) score -= 2;
      if (as && col == mid) score += 2;
      if (col > mid) score += 2;
    }
  }
  let seats_as_array = Object.entries(seats_as_object);
  seats_as_array = seats_as_array.map(([key, seat]) => seat);
  return seats_as_array;
}
function calculat_seats(seats, map, groups) {
  seats = row_score(seats);
  seats = col_score(seats, map);
  seats = group_score(seats, groups);
  seats = seats.map((seat) => {
    let { row_score, col_score, pass_score } = seat;
    if (!row_score) row_score = 0;
    if (!col_score) col_score = 0;
    if (!pass_score) pass_score = 0;
    seat.score = row_score + col_score + pass_score;
    return seat;
  });
  return seats;
}

function get_project_id(project_name) {
  return new Promise((resolve, reject) => {
    const query_string = `SELECT * FROM projects WHERE name='${project_name}'`;
    con.query(query_string, (err, map_result) => {
      // console.log(map_result);
      if (err) reject(err);
      else resolve(map_result[0].id);
    });
  });
}
function getSeats(map_id) {
  return new Promise((resolve, reject) => {
    const query_string = `SELECT * FROM seats WHERE map='${map_id}';`;
    con.query(query_string, (err, seats_result) => {
      if (err) reject(err);
      else resolve(seats_result);
    });
  });
}
function getSeatsGroups(map_id) {
  return new Promise((resolve, reject) => {
    const query_string = `SELECT * FROM seats_groups WHERE map = '${map_id}';`;
    con.query(query_string, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}
function getMap(project_name, map_name) {
  return new Promise(async (resolve, reject) => {
    const project_id = await get_project_id(project_name);
    const query_string = `SELECT * FROM maps WHERE project = '${project_id}' AND map_name = '${map_name}';`;
    con.query(query_string, (err, result) => {
      if (err) reject(err);
      else resolve(result[0]);
    });
  });
}

async function getSeatsScoreByMap(project_name, map_name) {
  const map = await getMap(project_name, map_name);
  const seats_result = await getSeats(map.id);
  const groups_result = await getSeatsGroups(map.id);
  const map_seats = calculat_seats(seats_result, map, groups_result);
  return map_seats;
}

export default getSeatsScoreByMap;
