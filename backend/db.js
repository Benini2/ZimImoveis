const mysql = require("mysql2/promise");

const connectionURL = process.env.MYSQL_PUBLIC_URL;

if (!connectionURL) {
  console.error("❌ MYSQL_PUBLIC_URL não encontrada!");
  process.exit(1);
}

const url = new URL(connectionURL);
const config = {
  host: url.hostname,
  port: parseInt(url.port),
  user: url.username,
  password: url.password,
  database: url.pathname.slice(1),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: { rejectUnauthorized: false }
};

const pool = mysql.createPool(config);

console.log("✅ Pool conectado:", config.host, config.database);

module.exports = { pool };