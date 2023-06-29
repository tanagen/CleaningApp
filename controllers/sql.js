const mysql = require("mysql");
const config = require("../config");

// mysqlの接続情報
exports.connection = mysql.createConnection({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database,
});
