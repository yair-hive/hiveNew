import mysql2 from 'mysql2';

const con = mysql2.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'hive',
  multipleStatements: true,
  port: 3306,
});

export default con;
