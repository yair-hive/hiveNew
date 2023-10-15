import mysql2 from 'mysql2';

const con = mysql2.createConnection({
  host: 'localhost',
  user: 'root',
  password: '24290678',
  database: 'hive',
  multipleStatements: true,
  port: 3306,
});

export default con;
