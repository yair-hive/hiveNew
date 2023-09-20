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
  guestIdFromNumber,
  tagIdFromNumber,
} from './functions.js';

const requests_belongs = {};

requests_belongs.create = async function (request_body) {
  check_parameters(['project_name'], request_body);
  const { project_name } = request_body;
  let guest_id;
  if (request_body.id_number) {
    guest_id = await guestIdFromNumber(request_body.id_number);
  } else {
    guest_id = request_body.guest_id;
  }
  let request_id;
  if (request_body.tag_code) {
    request_id = await tagIdFromNumber(request_body.tag_code, project_name);
  } else {
    request_id = request_body.tag_id;
  }

  const project_id = await get_project_id(project_name);
  let query_string = ``;

  let newIK;

  if (request_body.index_key === 'undefined') {
    query_string = `SELECT * FROM guests_requests WHERE guest = '${guest_id}'`;
    const guestRequests = await db_get(query_string);

    const GRIK = guestRequests.map((req) => {
      return req?.index_key;
    });
    newIK = 1;
    if (GRIK.length) newIK = Math.max(...GRIK) + 1;
  } else {
    newIK = request_body.index_key;
  }

  query_string = `SELECT * FROM guests_requests WHERE guest = '${guest_id}' AND request = '${request_id}' AND index_key = '${newIK}'`;
  await check_exists(query_string);

  query_string = `INSERT INTO guests_requests(id, guest, request, project, index_key) VALUES(UUID(), '${guest_id}', '${request_id}', '${project_id}', '${newIK}')`;
  await db_post(query_string);
};
requests_belongs.delete = async function (request_body) {
  check_parameters(['request_id'], request_body);
  const { request_id } = request_body;
  const request = await db_get(
    `SELECT * FROM guests_requests WHERE id = '${request_id}'`
  );

  const request2 = await db_get(
    `SELECT * FROM guests_requests WHERE guest = '${request[0].guest}' AND index_key = ${request[0].index_key}`
  );

  const query_string = `DELETE FROM guests_requests WHERE id = '${request_id}'`;
  await db_post(query_string);
  if (!request2[1]) {
    await db_post(
      `UPDATE guests_requests SET index_key = index_key -1 WHERE guest = '${request[0].guest}' AND index_key > ${request[0].index_key}`
    );
  }
};
requests_belongs.get_all = async function (request_body) {
  check_parameters(['project_name'], request_body);
  const { project_name } = request_body;
  const project_id = await get_project_id(project_name);
  const query_string = `SELECT * FROM guests_requests WHERE project = '${project_id}' ORDER BY index_key`;
  return await db_get(query_string);
};

export default requests_belongs;
