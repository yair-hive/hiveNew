/* eslint-disable camelcase */
import con from './connction.js';

function mysqlQuery(query_string) {
  return new Promise((resolve, reject) => {
    con.query(query_string, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

async function getProjectId(project_name) {
  const query_string = `SELECT * FROM projects WHERE name = '${project_name}'`;
  const result = await mysqlQuery(query_string);
  return result[0].id;
}

async function getMapId(project_name, map_name) {
  const project_id = await getProjectId(project_name);
  const query_string = `SELECT * FROM maps WHERE map_name = '${map_name}' AND project = ${project_id}`;
  const result = await mysqlQuery(query_string);
  return result[0].id;
}

export default {
  mysqlQuery,
  getMapId,
  getProjectId,
};
