/* eslint-disable no-return-await */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable func-names */
/* eslint-disable camelcase */

import { db_post, db_get, check_parameters, get_map_id } from './functions.js';

const seats_groups = {};

seats_groups.create = async function (request_body) {
  check_parameters(
    [
      'group_name',
      'from_row',
      'from_col',
      'to_row',
      'to_col',
      'map_name',
      'project_name',
    ],
    request_body
  );
  const { group_name } = request_body;
  const { from_row } = request_body;
  const { from_col } = request_body;
  const { to_row } = request_body;
  const { to_col } = request_body;
  const { map_name } = request_body;
  const { project_name } = request_body;
  const map_id = await get_map_id(map_name, project_name);
  const query_string = `INSERT INTO seats_groups(id, name, from_row, from_col, to_row, to_col, map) VALUES(UUID(), '${group_name}', '${from_row}', '${from_col}', '${to_row}', '${to_col}', '${map_id}')`;
  return await db_post(query_string);
};
seats_groups.get_all = async function (request_body) {
  check_parameters(['map_name', 'project_name'], request_body);
  const { map_name } = request_body;
  const { project_name } = request_body;
  const map_id = await get_map_id(map_name, project_name);
  const query_string = `SELECT * FROM seats_groups WHERE map = '${map_id}'`;
  return await db_get(query_string);
};
seats_groups.delete = async function (request_body) {
  check_parameters(['groups_ids'], request_body);
  const groups_ids = JSON.parse(request_body.groups_ids);
  let query_string = '';
  groups_ids.forEach((id) => {
    query_string += `DELETE FROM seats_groups WHERE id = '${id}'`;
  });
  await db_post(query_string);
};
// seats_groups.update = function (request_body) {};

export default seats_groups;
