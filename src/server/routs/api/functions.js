/* eslint-disable no-param-reassign */
/* eslint-disable no-return-await */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable func-names */
/* eslint-disable camelcase */

import con from '../../db/mysql/connction.js';

export function db_post(query_string) {
  return new Promise((resolve, reject) => {
    con.query(query_string, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}
export function db_get(query_string) {
  return new Promise((resolve, reject) => {
    con.query(query_string, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}
export function db_get_one(query_string) {
  return new Promise((resolve, reject) => {
    con.query(query_string, (err, result) => {
      if (err) reject(err);
      else resolve(result[0]);
    });
  });
}

export function check_exists(query_string) {
  return new Promise((resolve, reject) => {
    con.query(query_string, (err, result) => {
      if (err) reject(err);
      else if (result.length !== 0) {
        // throw new Error('exists');
        // eslint-disable-next-line prefer-promise-reject-errors
        reject('ex');
      } else resolve(result);
    });
  });
}
export function check_not_exists_f(query_string) {
  return new Promise((resolve, reject) => {
    con.query(query_string, (err, result) => {
      if (err) reject(err);
      else resolve(result.length === 0);
    });
  });
}
export function check_parameters(parameters, request_body) {
  parameters.forEach((param) => {
    if (!request_body[param] || request_body[param].length === 0) {
      throw new Error(`חסר פרמטר ${param}`);
    }
  });
}

export async function get_project_id(project_name) {
  const query_string = `SELECT id FROM projects WHERE name = '${project_name}'`;
  const result = await db_get(query_string);
  return await result[0].id;
}
export async function get_map_id(map_name, project_name) {
  const project_id = await get_project_id(project_name);
  const query_string = `SELECT id FROM maps WHERE map_name = '${map_name}' AND project = '${project_id}'`;
  const result = await db_get(query_string);
  return result[0].id;
}

export async function create_default_group(project_id, group_name) {
  const color = '#2b4e81';
  const score = 0;
  const query_string = `INSERT INTO guests_groups(id, name, color, score, project) VALUES(UUID(), '${group_name}', '${color}', '${score}', '${project_id}')`;
  await db_post(query_string);
}
export async function get_group_id(project_id, group_name) {
  if (group_name.length === 0) {
    group_name = 'ללא קבוצה';
  }
  let query_string = `SELECT * FROM guests_groups WHERE name = '${group_name}' AND project = '${project_id}'`;
  let result = await db_get_one(query_string);
  if (result) {
    return result.id;
  }
  await create_default_group(project_id, group_name);
  query_string = `SELECT * FROM guests_groups WHERE name = '${group_name}' AND project = '${project_id}'`;
  result = await db_get_one(query_string);
  return result.id;
}
export async function create_default_tag(tag_name, project_name) {
  const project_id = await get_project_id(project_name);
  const query_string = `INSERT INTO tags(id, name, color, score, project) VALUES(UUID(), '${tag_name}', '#2b4e81', '0', '${project_id}')`;
  await db_post(query_string);
}
export async function get_tag_id(tag_name, project_name) {
  const project_id = await get_project_id(project_name);
  const query_string = `SELECT id FROM tags WHERE name = '${tag_name}' AND project = '${project_id}'`;
  let result = await db_get_one(query_string);
  if (!result) {
    await create_default_tag(tag_name, project_name);
    result = await db_get_one(query_string);
  }
  return result.id;
}
