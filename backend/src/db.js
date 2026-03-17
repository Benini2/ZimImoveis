const mysql = require("mysql2/promise");

const connectionURL = process.env.MYSQL_PUBLIC_URL;

const url = new URL(connectionURL);
const config = {
  host: url.hostname,
  port: parseInt(url.port),
  user: url.username,
  password: url.password,
  database: url.pathname.slice(1),
  connectionLimit: 10,
  ssl: {
    mode: "required"
  }
};

const pool = mysql.createPool(config);
module.exports = { pool };