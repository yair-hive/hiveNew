/* eslint-disable no-return-await */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable func-names */
/* eslint-disable camelcase */

import {
  db_post,
  db_get,
  check_parameters,
  get_project_id,
  get_map_id,
} from './functions.js';

import getSeatsScoreByMap from '../get_seats_score.js';

const seats = {};

seats.create = async function (request_body) {
  check_parameters(['map_name', 'project_name', 'data'], request_body);
  const { map_name } = request_body;
  const { project_name } = request_body;
  const project_id = await get_project_id(project_name);
  const map_id = await get_map_id(map_name, project_name);
  const data = JSON.parse(request_body.data);
  let query_string = '';
  data.forEach((seat) => {
    query_string += `INSERT INTO seats(id, belong, row_num, col_num, map, project) VALUES(UUID(), '${map_id}', '${seat.row}', '${seat.col}', '${map_id}', '${project_id}');`;
  });
  return await db_post(query_string);
};
seats.get = async function (request_body) {
  check_parameters(['map_name', 'project_name'], request_body);
  const { map_name } = request_body;
  const { project_name } = request_body;
  // var map_id = await get_map_id(map_name, project_name);
  // var query_string = `SELECT * FROM seats WHERE map = '${map_id}'`;
  // return await db_get(query_string);
  return await getSeatsScoreByMap(project_name, map_name);
};
seats.get_all = async function (request_body) {
  check_parameters(['project_name'], request_body);
  const { project_name } = request_body;
  const project_id = await get_project_id(project_name);
  const query_string = `SELECT * FROM seats WHERE project = '${project_id}'`;
  return await db_get(query_string);
};
seats.delete = async function (request_body) {
  check_parameters(['seats_ids'], request_body);
  const seats_ids = JSON.parse(request_body.seats_ids);
  let query_string = '';
  seats_ids.forEach((id) => {
    query_string += `DELETE FROM seats WHERE id='${id}';`;
    query_string += `DELETE FROM belong WHERE seat='${id}';`;
    query_string += `DELETE FROM seat_groups_belong WHERE seat='${id}';`;
  });
  await db_post(query_string);
};
seats.update = async function (request_body) {
  const filds = {};
  filds.numbers = async function () {
    check_parameters(['seats_numbers'], request_body);
    const data = JSON.parse(request_body.seats_numbers);
    let query_string = '';
    data.forEach((seat) => {
      query_string += `UPDATE seats SET seat_number = '${seat.number}' WHERE id = '${seat.id}';`;
    });
    return await db_post(query_string);
  };
  check_parameters(['fild'], request_body);
  const { fild } = request_body;
  if (!filds[fild]) {
    throw new Error('parameter missing: fild');
  }
  await filds[fild]();
};

export default seats;
