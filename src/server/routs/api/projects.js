/* eslint-disable func-names */
/* eslint-disable vars-on-top */
/* eslint-disable camelcase */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-var */
/* eslint-disable no-return-await */
import { db_post, db_get, check_parameters } from './functions.js';

const projects = {};

projects.create = async function (request_body) {
  check_parameters(['name'], request_body);
  var name = request_body.name;
  var query_string = `INSERT INTO projects (id, name) VALUES (UUID(), '${name}')`;
  await db_post(query_string);
};
projects.get = async function () {
  var query_string = 'SELECT * FROM projects';
  return await db_get(query_string);
};

export default projects;
