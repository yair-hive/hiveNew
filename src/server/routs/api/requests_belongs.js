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
  check_exists,
  check_parameters,
  get_project_id,
} from './functions.js';

const requests_belongs = {};

requests_belongs.create = async function (request_body) {
  check_parameters(['guest_id', 'tag_id', 'project_name'], request_body);
  const { guest_id } = request_body;
  const request_id = request_body.tag_id;
  const { project_name } = request_body;
  const project_id = await get_project_id(project_name);
  let query_string = ``;
  query_string = `SELECT * FROM guests_requests WHERE guest = '${guest_id}' AND request = '${request_id}'`;
  await check_exists(query_string);
  query_string = `INSERT INTO guests_requests(id, guest, request, project) VALUES(UUID(), '${guest_id}', '${request_id}', '${project_id}')`;
  await db_post(query_string);
};
requests_belongs.delete = async function (request_body) {
  check_parameters(['request_id'], request_body);
  const { request_id } = request_body;
  const query_string = `DELETE FROM guests_requests WHERE id = '${request_id}'`;
  await db_post(query_string);
};
requests_belongs.get_all = async function (request_body) {
  check_parameters(['project_name'], request_body);
  const { project_name } = request_body;
  const project_id = await get_project_id(project_name);
  const query_string = `SELECT * FROM guests_requests WHERE project = '${project_id}'`;
  return await db_get(query_string);
};

export default requests_belongs;
