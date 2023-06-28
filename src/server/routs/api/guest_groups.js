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
  get_group_id,
} from './functions.js';

const guest_groups = {};

guest_groups.get_all = async function (request_body) {
  check_parameters(['project_name'], request_body);
  const { project_name } = request_body;
  const project_id = await get_project_id(project_name);
  const query_string = `SELECT * FROM guests_groups WHERE project='${project_id}'`;
  const results = await db_get(query_string);
  const new_results = {};
  results.forEach((row) => {
    new_results[row.id] = row;
  });
  return new_results;
};
guest_groups.delete = async function (request_body) {
  check_parameters(['group_id', 'project_name'], request_body);
  const { group_id } = request_body;
  const project_id = await get_project_id(request_body.project_name);
  let query_string = '';
  const und_group_id = await get_group_id(project_id, 'ללא קבוצה');
  query_string += `UPDATE guests SET guest_group = '${und_group_id}' WHERE guest_group = '${group_id}';`;
  query_string += `DELETE FROM guests_groups WHERE id='${group_id}';`;
  await db_post(query_string);
};
guest_groups.update = async function (request_body) {
  const filds = {};
  filds.name = async function () {
    check_parameters(['group_id', 'name'], request_body);
    const { group_id } = request_body;
    const { name } = request_body;
    const query_string = `UPDATE guests_groups SET name = '${name}' WHERE id = '${group_id}'`;
    await db_post(query_string);
  };
  filds.color = async function () {
    check_parameters(['group_id', 'color'], request_body);
    const { group_id } = request_body;
    const { color } = request_body;
    const query_string = `UPDATE guests_groups SET color = '${color}' WHERE id = '${group_id}'`;
    await db_post(query_string);
  };
  filds.score = async function () {
    check_parameters(['group_id', 'score'], request_body);
    const { group_id } = request_body;
    const { score } = request_body;
    const query_string = `UPDATE guests_groups SET score = '${score}' WHERE id = '${group_id}'`;
    await db_post(query_string);
  };
  check_parameters(['fild'], request_body);
  const { fild } = request_body;
  if (!filds[fild]) {
    throw new Error('parameter missing: fild');
  }
  await filds[fild]();
};

export default guest_groups;
