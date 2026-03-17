import mysql from "mysql2/promise";

const connectionURL = process.env.MYSQL_PUBLIC_URL;

export const pool = mysql.createPool({
  uri: connectionURL,
  ssl: {
    rejectUnauthorized: true // obrigatório para proxies do Railway
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;