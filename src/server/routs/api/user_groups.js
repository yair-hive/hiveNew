/* eslint-disable no-return-await */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable func-names */
/* eslint-disable camelcase */

import { db_post, db_get, check_parameters } from './functions.js';

const user_groups = {};

user_groups.get_all = async function () {
  let query_string = ``;
  query_string = `SELECT * FROM users_groups`;
  const groups = await db_get(query_string);
  const new_groups = [];
  for (const group of groups) {
    const group_id = group.id;
    query_string = `SELECT * FROM users_groups_actions WHERE belong = ${group_id}`;
    group.actions = await db_get(query_string);
    new_groups.push(group);
  }
  return new_groups;
};
user_groups.get_group_actions = async function (request_body) {
  check_parameters(['group_id'], request_body);
  const { group_id } = request_body;
  const query_string = `SELECT * FROM users_groups_actions WHERE belong = ${group_id}`;
  return await db_get(query_string);
};
user_groups.create = async function (request_body) {
  check_parameters(['name'], request_body);
  const { name } = request_body;
  const query_string = `INSERT INTO users_groups(id, name) VALUES(UUID(), '${name}')`;
  return await db_post(query_string);
};
user_groups.add_action = async function (request_body) {
  check_parameters(['group_id', 'action_name'], request_body);
  const belong = request_body.group_id;
  const action = request_body.action_name;
  const query_string = `INSERT INTO users_groups_actions(belong, action) VALUES('${belong}', '${action}')`;
  return await db_post(query_string);
};

export default user_groups;
