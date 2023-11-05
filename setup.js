const mysql2 = require('mysql2');

const fs = require('fs');

const dataSql = fs.readFileSync('./hive.sql').toString();

const con = mysql2.createConnection({
  host: 'localhost',
  user: 'root',
  password: '24290678',
  database: 'hive',
  multipleStatements: true,
  port: 3306,
});

con.query(dataSql, function () {
  console.log('________ttt_________');
});
