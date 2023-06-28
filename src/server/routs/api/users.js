/* eslint-disable no-return-await */
/* eslint-disable func-names */
/* eslint-disable prefer-destructuring */
/* eslint-disable camelcase */
import { db_post, db_get, check_parameters } from './functions.js';

const users = {};

users.login = async function (request_body, req) {
  check_parameters(['user_name', 'password'], request_body);
  const { user_name } = request_body;
  const { password } = request_body;
  const query_string = `SELECT * FROM users WHERE user_name = '${user_name}'`;
  const user_data = await db_get(query_string);
  if (user_data[0].password === password) {
    req.session.user = user_data[0];
  }
  return true;
};
users.logout = async function (request_body, req) {
  req.session.user = undefined;
  return true;
};
users.create = async function (request_body) {
  check_parameters(['user_name', 'password'], request_body);
  const { user_name } = request_body;
  const { password } = request_body;
  const query_string = `INSERT INTO users(user_name, password) VALUES('${user_name}', '${password}')`;
  return await db_post(query_string);
};
users.delete = async function (request_body) {
  check_parameters(['user_id'], request_body);
};
users.get_all = async function () {
  const query_string = `SELECT * FROM users`;
  return await db_get(query_string);
};
users.get_active = async function (request_body, req) {
  return req.session.user?.user_name;
};

export default users;
