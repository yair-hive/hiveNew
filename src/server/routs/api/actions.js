/* eslint-disable no-param-reassign */
/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-return-assign */
/* eslint-disable no-loop-func */
/* eslint-disable no-return-await */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable func-names */
/* eslint-disable camelcase */

import con from '../../db/mysql/connction.js';
import wss from '../../socket.js';
import { check_parameters } from './functions.js';

const projectActions = {};

function row_score(seats) {
  const rows = [];

  seats.forEach((seat) => {
    if (rows.indexOf(seat.row_num) === -1) rows.push(seat.row_num);
  });

  rows.sort(function (a, b) {
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
  cols.sort(function (a, b) {
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
  let score;
  if (to === 'center') {
    cols.reverse();
    for (const col of cols) {
      n++;
      if (cols_even) {
        if (n !== cols_middle + 1) {
          if (n < cols_middle) i++;
          if (n > cols_middle) i--;
        }
        if (n === cols_middle) i++;
        score = Math.abs(i);
      } else {
        if (n > cols_middle) i--;
        if (n < cols_middle) i++;
        if (n === cols_middle) i++;
        score = i;
        if (n === cols_middle) score = Math.abs(i);
      }
      seats_by_col[col].forEach((index) => {
        seats[index].col_score = score;
      });
    }
  }
  if (to === 'left') {
    cols.reverse();
    let score = 0;
    for (const col of cols) {
      score++;
      seats_by_col[col].forEach((index) => {
        seats[index].col_score = score;
      });
    }
  }
  if (to === 'right') {
    let score = 0;
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
    const group_seats = [];
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

    const seats_by_col = {};
    cols.forEach((col) => (seats_by_col[col.toString()] = []));
    group_seats.forEach((seat, index) =>
      seats_by_col[seat.col_num].push(index)
    );

    cols.sort(function (a, b) {
      return a - b;
    });

    let score = 20;
    const mid = Math.floor((cols[0] + cols[cols.length - 1]) / 2);
    const as = (cols.length / 2) % 1 !== 0;
    for (const col of cols) {
      seats_by_col[col].forEach((index) => {
        const seat_id = group_seats[index].id;
        seats_as_object[seat_id].pass_score = score;
      });
      if (col < mid) score -= 2;
      if (as && col === mid) score += 2;
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
function calculat_guests(guests, groups) {
  const groups_as_object = {};
  groups.forEach((group) => (groups_as_object[group.id] = group));
  guests = guests.map((guest) => {
    guest.score += groups_as_object[guest.guest_group].score;
    return guest;
  });
  return guests;
}
function calculat_tags(seats, tags) {
  const tags_as_object = {};
  tags.forEach((tag) => (tags_as_object[tag.seat] = []));
  tags.forEach((tag) => tags_as_object[tag.seat].push(tag.tag));
  return seats.map((seat) => {
    if (tags_as_object[seat.id]) seat.tags = tags_as_object[seat.id];
    return seat;
  });
}
function calculat_requests(guests, requests) {
  const requests_as_object = {};
  requests.forEach((request) => (requests_as_object[request.guest] = []));
  requests.forEach((request) =>
    requests_as_object[request.guest].push(request.request)
  );
  return guests.map((guest) => {
    if (requests_as_object[guest.id])
      guest.requests = requests_as_object[guest.id];
    return guest;
  });
}
function calculat_seats_belongs(belongs) {
  const by_seat = {};
  const by_guest = {};
  belongs.forEach((belong) => {
    by_seat[belong.seat] = belong.fixed;
    by_guest[belong.guest] = belong.fixed;
  });
  return [by_guest, by_seat];
}

function get_project_id(project_name) {
  return new Promise((resolve, reject) => {
    const query_string = `SELECT * FROM projects WHERE name='${project_name}'`;
    con.query(query_string, (err, map_result) => {
      if (err) reject(err);
      else resolve(map_result[0].id);
    });
  });
}
function getMaps(project_id) {
  return new Promise((resolve, reject) => {
    const query_string = `SELECT * FROM maps WHERE project='${project_id}'`;
    con.query(query_string, (err, map_result) => {
      if (err) reject(err);
      else resolve(map_result);
    });
  });
}
function getSeatsBelongs(project_id) {
  return new Promise((resolve, reject) => {
    const query_string = `SELECT * FROM belong WHERE project = '${project_id}'`;
    con.query(query_string, (err, result) => {
      if (err) reject(err);
      else resolve(result);
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
function getTagsBelongs(map_id) {
  return new Promise((resolve, reject) => {
    const query_string = `SELECT * FROM tag_belongs WHERE map = '${map_id}'`;
    con.query(query_string, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

function getGuests(project_id) {
  return new Promise((resolve, reject) => {
    const query_string = `SELECT * FROM guests WHERE project = '${project_id}';`;
    con.query(query_string, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}
function getGuestsGroup(project_id) {
  return new Promise((resolve, reject) => {
    const query_string = `SELECT * FROM guests_groups WHERE project = '${project_id}';`;
    con.query(query_string, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}
function getRequests(project_id) {
  return new Promise((resolve, reject) => {
    const query_string = `SELECT * FROM guests_requests WHERE project = '${project_id}' ORDER BY index_key`;
    con.query(query_string, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

function getRandomNumber(max) {
  const min = 0;
  const step1 = max - min + 1;
  const step2 = Math.random() * step1;
  const result = Math.floor(step2) + min;
  return result;
}
function getGuestsScores(guests) {
  const guests_scores = [];
  guests.forEach((guest) => {
    if (guests_scores.indexOf(guest.score) === -1)
      guests_scores.push(guest.score);
  });
  guests_scores.sort(function (a, b) {
    return a - b;
  });
  guests_scores.reverse();
  return guests_scores;
}
function getSeatsScores(seats) {
  const seats_scores = [];
  seats.forEach((seat) => {
    if (seats_scores.indexOf(seat.score) === -1) seats_scores.push(seat.score);
  });
  seats_scores.sort(function (a, b) {
    return a - b;
  });
  seats_scores.reverse();
  return seats_scores;
}
function getGuestWithScore(guests, score) {
  const new_guests = [];
  guests.forEach((guest, index) => {
    if (guest.score === score) new_guests.push(index);
  });
  return new_guests;
}
function getSeatWithScore(seats, score) {
  const new_seats = [];
  seats.forEach((seat, index) => {
    if (seat.score === score) new_seats.push(index);
  });
  return new_seats;
}
function getSeatWithTag(seats, tag) {
  const new_seats = [];
  seats.forEach((seat, index) => {
    if (seat.tags) {
      if (seat.tags.indexOf(tag) > -1) {
        seat.index = index;
        new_seats.push(seat);
      }
    }
  });
  return new_seats;
}
function getSeatWithTagAndScore(seats) {
  const score = getSeatsScores(seats)[0];
  const new_seats = [];
  seats.forEach((seat) => {
    if (seat.score === score) new_seats.push(seat.index);
  });
  return new_seats;
}
function addAllMatchs(matching_list, project_id) {
  return new Promise((resolve, reject) => {
    let query_string = ``;
    matching_list.forEach((match) => {
      const { guest, seat } = match;
      query_string += `DELETE FROM belong WHERE guest='${guest}';`;
      query_string += `DELETE FROM belong WHERE seat='${seat}';`;
      query_string += `INSERT INTO belong(id, guest, seat, project) VALUES(UUID(), '${guest}', '${seat}', '${project_id}');`;
    });
    con.query(query_string, (err) => {
      if (err) reject(err);
      else resolve('all_ok');
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
function getTags(project_id) {
  return new Promise(async (resolve, reject) => {
    const query_string = `SELECT * FROM tags WHERE project = '${project_id}';`;
    con.query(query_string, (err, result) => {
      if (err) reject(err);
      else resolve(result[0]);
    });
  });
}
projectActions.scheduling = async (request_body) => {
  check_parameters(['project_name', 'socketId'], request_body);
  const { project_name, socketId } = request_body;
  const project_id = await get_project_id(project_name);

  let seats = [];
  const matching_list = [];
  const maps = await getMaps(project_id);
  for (const map of maps) {
    const seats_result = await getSeats(map.id);
    const groups_result = await getSeatsGroups(map.id);
    const tags_belongs = await getTagsBelongs(map.id);
    let map_seats = calculat_seats(seats_result, map, groups_result);
    map_seats = calculat_tags(map_seats, tags_belongs);
    seats.push(...map_seats);
  }
  let guests_result = await getGuests(project_id);
  const seats_belongs = await getSeatsBelongs(project_id);
  const guests_group = await getGuestsGroup(project_id);
  const requests = await getRequests(project_id);
  const tags = await getTags(project_id);

  const tagsAsObject = {};
  tags.forEach((tag) => {
    tagsAsObject[tag.id] = tag;
  });

  const [belogs_by_guest, belong_by_seat] =
    calculat_seats_belongs(seats_belongs);

  guests_result = guests_result.filter((guest) => {
    return belogs_by_guest[guest.id] !== 1;
  });

  seats = seats.filter((seat) => {
    return belong_by_seat[seat.id] !== 1;
  });

  seats = seats.map((seat) => {
    let tagsScore = 0;
    seat.tags.forEach((tag) => {
      tagsScore += tagsAsObject[tag].score;
    });
    seat.score += tagsScore;
    return seat;
  });

  let guests = calculat_guests(guests_result, guests_group);
  guests = calculat_requests(guests, requests);

  const total_iterations = Math.min(seats.length, guests.length);
  let completed_iterations = 0;
  let progress = 0;
  let i = 0;

  function update_progress() {
    wss.sendTo(socketId, { action: 'progress', progress });
  }
  const progressInterval = setInterval(update_progress, 500);

  while (seats.length !== 0 && guests.length !== 0) {
    i++;

    const guests_scores = getGuestsScores(guests);
    const height_guests = getGuestWithScore(guests, guests_scores[0]);
    const random_for_guest = getRandomNumber(height_guests.length - 1);
    const random_guest_index = height_guests[random_for_guest];
    const guest = guests[random_guest_index];
    const guest_id = guest.id;

    if (guest.number_of_seats > 1) {
      guests.splice(random_guest_index, 1);
      continue;
    }
    const seats_scores = getSeatsScores(seats);
    let height_seats = getSeatWithScore(seats, seats_scores[0]);

    if (guest.requests) {
      for (let i = 0; i < guest.requests.length; i++) {
        const seats_with_tags = getSeatWithTag(seats, guest.requests[i]);
        if (getSeatWithTagAndScore(seats_with_tags).length > 0) {
          height_seats = getSeatWithTagAndScore(seats_with_tags);
          break;
        }
      }
    }

    const random_for_seat = getRandomNumber(height_seats.length - 1);
    const random_seat_index = height_seats[random_for_seat];
    const seat = seats[random_seat_index];
    const seat_id = seat.id;

    matching_list.push({ guest: guest_id, seat: seat_id });
    guests.splice(random_guest_index, 1);
    seats.splice(random_seat_index, 1);

    completed_iterations++;
    progress = (completed_iterations / total_iterations) * 100;
    progress = Math.round(progress);

    await addAllMatchs([{ guest: guest_id, seat: seat_id }], project_id);
  }
};

export default projectActions;
