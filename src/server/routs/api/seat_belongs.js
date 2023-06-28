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
  check_not_exists_f,
  check_parameters,
  get_project_id,
} from './functions.js';

const seat_belongs = {};

seat_belongs.create = async function (request_body) {
  check_parameters(['project_name', 'seat_id', 'guest_id'], request_body);
  const { project_name } = request_body;
  const project_id = await get_project_id(project_name);
  const { seat_id } = request_body;
  const { guest_id } = request_body;
  let query_string = '';
  query_string += `DELETE FROM belong WHERE guest='${guest_id}';`;
  query_string += `DELETE FROM belong WHERE seat='${seat_id}';`;
  query_string += `INSERT INTO belong(id, guest, seat, project) VALUES(UUID(), '${guest_id}', '${seat_id}', '${project_id}');`;
  await db_post(query_string);
};
seat_belongs.get_all = async function (request_body) {
  check_parameters(['project_name'], request_body);
  const { project_name } = request_body;
  const project_id = await get_project_id(project_name);
  const query_string = `SELECT * FROM belong WHERE project='${project_id}'`;
  return await db_get(query_string);
};
seat_belongs.check = async function (request_body) {
  check_parameters(['guest_id'], request_body);
  const { guest_id } = request_body;
  const query_string = `SELECT * FROM belong WHERE guest='${guest_id}'`;
  if (await check_not_exists_f(query_string)) {
    return { exist: false };
  }
  return { exist: true };
};
seat_belongs.delete_all = async function (request_body) {
  check_parameters(['project_name'], request_body);
  const project_name = request_body.projct_name;
  const project_id = await get_project_id(project_name);
  const query_string = `DELETE FROM belong WHERE project='${project_id}'`;
  return await db_get(query_string);
};
seat_belongs.set_fixed = async function (request_body) {
  check_parameters(['id', 'value'], request_body);
  const { id } = request_body;
  let { value } = request_body;
  if (value === 'true') value = 1;
  if (value === 'false') value = 0;
  const query_string = `UPDATE belong SET fixed = '${value}' WHERE id = '${id}'`;
  return await db_get(query_string);
};

export default seat_belongs;
