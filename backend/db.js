import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "shuttle.proxy.rlwy.net",
  port: 14106,
  user: "root",
  password: "YQgAHOcZlGbMEhhGXFGElXgcOymBckKn",
  database: "railway", // 👈 nome do banco correto
  ssl: {
    rejectUnauthorized: false
  }
});

export default pool;