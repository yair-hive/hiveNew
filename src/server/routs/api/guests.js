/* eslint-disable prefer-destructuring */
/* eslint-disable no-return-await */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable func-names */
/* eslint-disable camelcase */
import { v4 as uuidv4 } from 'uuid';
import {
  db_post,
  db_get,
  check_not_exists_f,
  check_parameters,
  get_project_id,
  get_group_id,
} from './functions.js';

import wss from '../../socket.js';

const guests = {};

async function getGuestGroupScore(guest_id) {
  let query_string = '';
  query_string = `SELECT * FROM guests WHERE id = '${guest_id}'`;
  const guest = await db_get(query_string);
  const { guest_group } = guest[0];
  query_string = `SELECT * FROM guests_groups WHERE id = '${guest_group}'`;
  const group = await db_get(query_string);
  return group[0].score;
}

guests.create = async function (request_body) {
  check_parameters(['guests', 'project_name', 'socketId'], request_body);
  const { guests } = request_body;
  const { socketId } = request_body;
  const data = JSON.parse(guests);
  const { project_name } = request_body;
  const project_id = await get_project_id(project_name);
  const total_iterations = data.length + 1;
  let completed_iterations = 0;
  let progress = 0;
  function update_progress() {
    wss.sendTo(socketId, { action: 'progress', progress });
  }
  const progressInterval = setInterval(() => {
    update_progress();
  }, 500);
  for (const guest of data) {
    let query_string = '';
    const first_name = guest[0];
    const last_name = guest[1];
    const guest_group = guest[2];
    const seat_number = guest[3];
    let id_number;
    if (request_body.importSeatNumber !== 'undefined') {
      id_number = guest[4];
    } else {
      id_number = guest[3];
    }
    completed_iterations++;
    progress = (completed_iterations / total_iterations) * 100;
    progress = Math.round(progress);
    if (!first_name || !last_name || !guest_group) continue;
    const guest_group_id = await get_group_id(project_id, guest_group);
    const s_query_string = `SELECT * FROM guests WHERE first_name='${first_name}' AND last_name='${last_name}' AND guest_group='${guest_group}' AND project='${project_id}'`;
    if (await check_not_exists_f(s_query_string)) {
      if (request_body.importSeatNumber !== 'undefined') {
        const guestId = uuidv4();
        query_string += `INSERT INTO guests(id, first_name, last_name, guest_group, project) VALUES('${guestId}', '${first_name}', '${last_name}', '${guest_group_id}', '${project_id}');`;
        const seat = await db_get(
          `SELECT * FROM seats WHERE project='${project_id}' AND seat_number='${seat_number}'`
        );
        if (seat[0]) {
          const seatId = seat[0].id;
          let query_string_2 = '';
          query_string_2 += `DELETE FROM belong WHERE guest='${guestId}';`;
          query_string_2 += `DELETE FROM belong WHERE seat='${seatId}';`;
          query_string_2 += `INSERT INTO belong(id, guest, seat, project) VALUES(UUID(), '${guestId}', '${seatId}', '${project_id}');`;
          await db_post(query_string_2);
        }
      } else if (request_body.importIdNumber !== 'undefined') {
        query_string += `INSERT INTO guests(id, id_number, first_name, last_name, guest_group, project) VALUES(UUID(), '${id_number}', '${first_name}', '${last_name}', '${guest_group_id}', '${project_id}');`;
      } else {
        query_string += `INSERT INTO guests(id, first_name, last_name, guest_group, project) VALUES(UUID(), '${first_name}', '${last_name}', '${guest_group_id}', '${project_id}');`;
      }
    }
    await db_post(query_string);
  }
  completed_iterations++;
  progress = (completed_iterations / total_iterations) * 100;
  clearInterval(progressInterval);
  update_progress();
};
guests.get_all = async function (request_body) {
  check_parameters(['project_name'], request_body);
  const { project_name } = request_body;
  const project_id = await get_project_id(project_name);
  const query_string = `SELECT * FROM guests WHERE project='${project_id}'`;
  return await db_get(query_string);
};
guests.delete = async function (request_body) {
  check_parameters(['guest_id'], request_body);
  const { guest_id } = request_body;
  let query_string = `DELETE FROM guests WHERE id='${guest_id}';`;
  query_string += `DELETE FROM belong WHERE guest='${guest_id}';`;
  await db_post(query_string);
};
guests.delete_all = async function (request_body) {
  check_parameters(['project_name'], request_body);
  const { project_name } = request_body;
  const project_id = await get_project_id(project_name);
  let query_string = `DELETE FROM guests WHERE project='${project_id}';`;
  query_string += `DELETE FROM belong WHERE project='${project_id}';`;
  await db_post(query_string);
};
guests.update = async function (request_body) {
  const filds = {};
  filds.first = async function () {
    check_parameters(['guest_id', 'first_name'], request_body);
    const { guest_id } = request_body;
    const { first_name } = request_body;
    const query_string = `UPDATE guests SET first_name = '${first_name}' WHERE id = '${guest_id}'`;
    await db_post(query_string);
  };
  filds.last = async function () {
    check_parameters(['guest_id', 'last_name'], request_body);
    const { guest_id } = request_body;
    const { last_name } = request_body;
    const query_string = `UPDATE guests SET last_name = '${last_name}' WHERE id = '${guest_id}'`;
    await db_post(query_string);
  };
  filds.group = async function () {
    check_parameters(['guest_id', 'group_name', 'project_name'], request_body);
    const { guest_id } = request_body;
    const { group_name } = request_body;
    const { project_name } = request_body;
    const project_id = await get_project_id(project_name);
    const group_id = await get_group_id(project_id, group_name);
    const query_string = `UPDATE guests SET guest_group = '${group_id}' WHERE id = '${guest_id}'`;
    await db_post(query_string);
  };
  filds.score = async function () {
    check_parameters(['guest_id', 'score'], request_body);
    const { guest_id } = request_body;
    let { score } = request_body;
    const group_score = await getGuestGroupScore(guest_id);
    score = Number(score) - Number(group_score);
    const query_string = `UPDATE guests SET score = '${score}' WHERE id = '${guest_id}'`;
    await db_post(query_string);
  };
  filds.amount = async function () {
    check_parameters(['guest_id', 'amount'], request_body);
    const { guest_id, amount } = request_body;
    const query_string = `UPDATE guests SET number_of_seats = '${amount}' WHERE id = '${guest_id}'`;
    await db_post(query_string);
  };
  check_parameters(['fild'], request_body);
  const { fild } = request_body;
  if (!filds[fild]) {
    throw new Error('parameter missing: fild');
  }
  await filds[fild]();
};

export default guests;
