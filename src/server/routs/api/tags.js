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
} from './functions.js';

const tags = {};

tags.get_all = async function (request_body) {
  check_parameters(['project_name'], request_body);
  const { project_name } = request_body;
  const project_id = await get_project_id(project_name);
  const query_string = `SELECT * FROM tags WHERE project = '${project_id}'`;
  const results = await db_get(query_string);
  const new_results = {};
  results.forEach((row) => {
    new_results[row.id] = row;
  });
  return new_results;
};
tags.delete = async function (request_body) {
  check_parameters(['tag_id'], request_body);
  const { tag_id } = request_body;
  let query_string = `DELETE FROM tags WHERE id = '${tag_id}';`;
  query_string += `DELETE FROM guests_requests WHERE request = '${tag_id}';`;
  query_string += `DELETE FROM tag_belongs WHERE tag = '${tag_id}';`;
  await db_post(query_string);
};
tags.update = async function (request_body) {
  const filds = {};
  filds.name = async function () {
    check_parameters(['name', 'tag_id'], request_body);
    const { name } = request_body;
    const { tag_id } = request_body;
    const query_string = `UPDATE tags SET name = '${name}' WHERE  id = '${tag_id}'`;
    await db_post(query_string);
  };
  filds.color = async function () {
    check_parameters(['color', 'tag_id'], request_body);
    const { color } = request_body;
    const { tag_id } = request_body;
    const query_string = `UPDATE tags SET color = '${color}' WHERE  id = '${tag_id}'`;
    await db_post(query_string);
  };
  filds.score = async function () {
    check_parameters(['score', 'tag_id'], request_body);
    const { score } = request_body;
    const { tag_id } = request_body;
    const query_string = `UPDATE tags SET score = '${score}' WHERE  id = '${tag_id}'`;
    await db_post(query_string);
  };
  check_parameters(['fild'], request_body);
  const { fild } = request_body;
  if (!filds[fild]) {
    throw new Error('parameter missing: fild');
  }
  await filds[fild]();
};

export default tags;
