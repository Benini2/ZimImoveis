import mysql from "mysql2/promise";

const connectionURL = process.env.MYSQL_PUBLIC_URL;

export const pool = mysql.createPool({
  uri: connectionURL,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;