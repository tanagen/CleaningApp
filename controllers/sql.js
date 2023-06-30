const mysql = require("mysql");
const config = require("../config");

// mysqlの接続情報
const connection = mysql.createConnection({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database,
});

const connect = connection.connect((err) => {
  if (err) {
    console.log("error connecting: " + err.stack);
    return;
  } else {
    console.log("sql_connection:success");
  }
});

module.exports = { connection, connect };
