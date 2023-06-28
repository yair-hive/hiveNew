/* eslint-disable no-return-await */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable func-names */
/* eslint-disable camelcase */
import { db_post, db_get, check_parameters, get_map_id } from './functions.js';

const map_elements = {};

map_elements.create = async function (request_body) {
  check_parameters(
    [
      'map_name',
      'project_name',
      'element_name',
      'from_row',
      'from_col',
      'to_row',
      'to_col',
    ],
    request_body
  );
  const { map_name } = request_body;
  const { project_name } = request_body;
  const map_id = await get_map_id(map_name, project_name);
  const { element_name } = request_body;
  const { from_row } = request_body;
  const { from_col } = request_body;
  const { to_row } = request_body;
  const { to_col } = request_body;
  const query_string = `INSERT INTO map_elements(id, name, from_row, from_col, to_row, to_col, map) VALUES(UUID(), '${element_name}', '${from_row}', '${from_col}', '${to_row}', '${to_col}', '${map_id}')`;
  await db_post(query_string);
};
map_elements.get_all = async function (request_body) {
  check_parameters(['map_name', 'project_name'], request_body);
  const { map_name } = request_body;
  const { project_name } = request_body;
  const map_id = await get_map_id(map_name, project_name);
  const query_string = ` SELECT * FROM map_elements WHERE map = '${map_id}'`;
  return await db_get(query_string);
};
map_elements.delete = async function (request_body) {
  check_parameters(['elements_ids'], request_body);
  const elemens_ids = JSON.parse(request_body.elements_ids);
  let query_string = '';
  elemens_ids.forEach((id) => {
    query_string += `DELETE FROM map_elements WHERE id = '${id}'`;
  });
  await db_post(query_string);
};

export default map_elements;
