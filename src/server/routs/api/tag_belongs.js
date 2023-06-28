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
  get_map_id,
  get_tag_id,
  get_project_id,
} from './functions.js';

const tag_belongs = {};

tag_belongs.create = async function (request_body) {
  check_parameters(
    ['seats', 'tag_name', 'map_name', 'project_name'],
    request_body
  );
  const seats = JSON.parse(request_body.seats);
  const { tag_name } = request_body;
  const { map_name } = request_body;
  const { project_name } = request_body;
  const map_id = await get_map_id(map_name, project_name);
  const tag_id = await get_tag_id(tag_name, project_name);
  let query_string = '';
  seats.forEach((seat) => {
    query_string += `INSERT INTO tag_belongs(id, seat, tag, map) VALUES(UUID(), '${seat}', '${tag_id}', '${map_id}');`;
  });
  return await db_post(query_string);
};
tag_belongs.get_all = async function (request_body) {
  check_parameters(['project_name'], request_body);
  const { project_name } = request_body;
  let query_string = ``;
  const project_id = await get_project_id(project_name);
  query_string = `SELECT * FROM maps WHERE project='${project_id}'`;
  const maps = await db_get(query_string);
  const all_results = [];
  for (const map of maps) {
    query_string = `SELECT * FROM tag_belongs WHERE map = '${map.id}'`;
    const results = await db_get(query_string);
    all_results.push(...results);
  }
  const new_results = {};
  all_results.forEach((row) => {
    new_results[row.seat] = [];
  });
  all_results.forEach((row) => {
    new_results[row.seat].push(row);
  });
  return new_results;
};

export default tag_belongs;
