// db.js
import mysql from "mysql2/promise";

const connectionURL = process.env.MYSQL_PUBLIC_URL;

if (!connectionURL) {
  throw new Error("MYSQL_PUBLIC_URL não está configurada!");
}

// Parse da URL para objeto de configuração
const url = new URL(connectionURL);
const config = {
  host: url.hostname,
  port: url.port,
  user: url.username,
  password: url.password,
  database: url.pathname.slice(1), // remove a '/'
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: false // importante para Railway
  }
};

export const pool = mysql.createPool(config);

console.log("✅ Pool MySQL configurado com sucesso!");

export default pool;