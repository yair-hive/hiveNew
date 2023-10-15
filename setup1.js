import mysql2 from "mysql2";

const con = mysql2.createConnection({
  host: "localhost",
  user: "root",
  password: "24290678",
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
  con.query("CREATE DATABASE hive", function (err, result) {
    if (err) throw err;
    console.log("Database created");
  });
});
